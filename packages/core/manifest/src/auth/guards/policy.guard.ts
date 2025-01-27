import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Rule } from '../types/rule.type'
import { EntityManifest, PolicyManifest } from '@repo/types'
import { AuthService } from '../auth.service'
import { Request } from 'express'
import { policies } from '../policies/policies'
import { EntityManifestService } from '../../manifest/services/entity-manifest.service'

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly entityManifestService: EntityManifestService,
    private readonly authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rule: Rule = this.reflector.get<Rule>('rule', context.getHandler())

    if (!rule) {
      return true
    }

    const entitySlug: string = context.getArgs()[0].params.entity
    const entityManifest: EntityManifest =
      this.entityManifestService.getEntityManifest({ slug: entitySlug })

    const rulePolicies: PolicyManifest[] = entityManifest.policies[rule]

    const req: Request = context.switchToHttp().getRequest()

    const { user, entitySlug: userEntitySlug }: any =
      (await this.authService.getUserFromRequest(req)) || {}

    let userEntityManifest: EntityManifest
    if (userEntitySlug) {
      userEntityManifest = this.entityManifestService.getEntityManifest({
        slug: userEntitySlug
      })
    } else {
      userEntityManifest = null
    }

    return rulePolicies.every((policy: PolicyManifest) => {
      const policyFn = policies[policy.access]

      // Execute the policy function that returns a boolean.
      return policyFn(user, userEntityManifest, { allow: policy.allow })
    })
  }
}
