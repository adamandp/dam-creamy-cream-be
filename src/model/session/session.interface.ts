export interface JwtPayload {
  sub: string;
  role: string;
}

export interface BrowserInfo {
  userAgent: string;
  ip: string;
}

export interface CreateRefreshDto {
  refreshToken: string;
  payload: JwtPayload;
}

export interface CreateTokenDto extends CreateRefreshDto {
  browserInfo: BrowserInfo;
}

export interface RefreshAccessTokenResDto {
  accessToken: string;
}

export interface CreateTokenResDto {
  refreshToken: string;
  accessToken: string;
}
