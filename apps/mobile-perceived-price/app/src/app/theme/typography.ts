export type TextStyle = {
  fontSize: number;
  lineHeight: number;
  fontWeight?: '400' | '500' | '600' | '700';
  fontFamily?: string;
};

export type AppTypography = {
  heading1: TextStyle;
  heading2: TextStyle;
  subtitle: TextStyle;
  body: TextStyle;
  caption: TextStyle;
};

export const appTypography: AppTypography = {
  heading1: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Pretendard-Bold'
  },
  heading2: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Pretendard-SemiBold'
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Pretendard-Medium'
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Pretendard-Regular'
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Pretendard-Regular'
  }
};


