import gql from 'graphql-tag';

export interface TechnewsArticle {
  title: string;
  summary: string;
  comments: string;
  url: string;
  image: string;
  grades: [string];
  areas: [string];
  createdAt: string;
  domain: string;
}

export interface MonthlyStats {
  month: string;
  count: number;
}

export interface TechnewsQueryResult {
  articlesStats?: MonthlyStats[];
  articles: TechnewsArticle[];
}

export const TechnewsQuery = gql`
  query($selectedMonth: String, $limit: Int, $offset: Int, $withStats: Boolean!) {
    articlesStats @include(if: $withStats) {
      month
      count
    }
    articles(selectedMonth: $selectedMonth, limit: $limit, offset: $offset) {
      title
      summary
      comments
      url
      image
      grades
      areas
      createdAt
      domain
    }
  }
`;
