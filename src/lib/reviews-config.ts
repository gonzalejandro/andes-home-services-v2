export const DEFAULT_MAPS_URL =
  'https://www.google.com/maps/place/Andes+Stump+Grinding/@42.6774895,-83.246131,17z/data=!3m1!4b1!4m6!3m5!1s0xaeb61f3cfc839df5:0x4ed1cac05ac51559!8m2!3d42.6774895!4d-83.246131!16s%2Fg%2F11yr_v_16d?entry=ttu';

export const REVIEWS_BLOB_PATH = 'google-reviews.json';

export const REVIEWS_MAX_AGE_DAYS = Number(process.env.REVIEWS_MAX_AGE_DAYS ?? 7);

export const REVIEWS_MAX_AGE_MS = REVIEWS_MAX_AGE_DAYS * 24 * 60 * 60 * 1000;
