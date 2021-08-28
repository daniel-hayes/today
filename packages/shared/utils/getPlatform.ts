export enum Platforms {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
}

const getPlatform = (platform: string): Platforms | null => {
  switch (platform) {
    case Platforms.DESKTOP:
      return Platforms.DESKTOP;
    case Platforms.MOBILE:
      return Platforms.MOBILE;
    default:
      return null;
  }
};

export default getPlatform;
