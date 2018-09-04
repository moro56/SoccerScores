import TeamCrestProvider from "./TeamCrestProvider";

function requireImage(image) {
  return TeamCrestProvider.IMAGES.hasOwnProperty(image) ? TeamCrestProvider.IMAGES[image] : null;
}

export {
  requireImage,
}