import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { PinoLogger } from 'nestjs-pino';
import { WebResponse } from 'src/common/common.interface';
import {
  CategoriesRecomendationRes,
  ProductRecomendationRes,
} from './recommendations.interface';

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(RecommendationsController.name);
  }

  @Get('classic')
  async getClassic(): Promise<WebResponse<ProductRecomendationRes[]>> {
    return this.recommendationsService.getClassicRecommendations();
  }

  @Get('categories')
  async getCategories(): Promise<WebResponse<CategoriesRecomendationRes[]>> {
    return this.recommendationsService.getCategoriesRecommendations();
  }

  @Get('offers')
  async getOffers(): Promise<WebResponse<ProductRecomendationRes[]>> {
    return this.recommendationsService.getOfferRecommendations();
  }

  @Get('related/:id')
  async getRelated(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WebResponse<ProductRecomendationRes[]>> {
    return this.recommendationsService.getRelatedRecommendations(id);
  }
}
