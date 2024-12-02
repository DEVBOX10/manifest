import { Test, TestingModule } from '@nestjs/testing'
import { OpenApiCrudService } from '../services/open-api-crud.service'
import { EntityManifest, PropType } from '@repo/types'

describe('OpenApiCrudService', () => {
  let service: OpenApiCrudService

  const dummyEntityManifest: EntityManifest = {
    className: 'Cat',
    nameSingular: 'cat',
    namePlural: 'cats',
    slug: 'cats',
    mainProp: 'name',
    seedCount: 50,
    belongsTo: [],
    relationships: [],
    properties: [
      {
        name: 'name',
        type: PropType.String
      }
    ],
    policies: {
      create: [],
      read: [],
      update: [],
      delete: [],
      signup: []
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenApiCrudService]
    }).compile()

    service = module.get<OpenApiCrudService>(OpenApiCrudService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should generate all 6 entity paths', () => {
    jest.spyOn(service, 'generateListPath').mockReturnValue({})
    jest.spyOn(service, 'generateListSelectOptionsPath').mockReturnValue({})
    jest.spyOn(service, 'generateCreatePath').mockReturnValue({})
    jest.spyOn(service, 'generateDetailPath').mockReturnValue({})
    jest.spyOn(service, 'generateUpdatePath').mockReturnValue({})
    jest.spyOn(service, 'generateDeletePath').mockReturnValue({})

    const paths = service.generateEntityPaths([dummyEntityManifest])

    expect(paths).toBeDefined()
    expect(Object.keys(paths).length).toBe(3)

    expect(service.generateListPath).toHaveBeenCalled()
    expect(service.generateListSelectOptionsPath).toHaveBeenCalled()
    expect(service.generateCreatePath).toHaveBeenCalled()
    expect(service.generateDetailPath).toHaveBeenCalled()
    expect(service.generateUpdatePath).toHaveBeenCalled()
    expect(service.generateDeletePath).toHaveBeenCalled()
  })
})
