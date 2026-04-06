import { HOME_CLIENT_NAMES } from './homeClientNames';

/**
 * Hover peek images under `public/imgs/` — same order as {@link HOME_CLIENT_NAMES}.
 * (Folder is named `imgs` in this project.)
 */
export const CLIENT_HOVER_IMAGES: readonly string[] = [
  '/imgs/Vogue_Rwanda/bhauma108_editorial_photography_of_black_mode._he_is_wearing__73ac47bf-7472-4f25-9790-96c7fac5c5b8_0.png',
  '/imgs/BVLGARI/bhauma108_editorial_photography_of_black_mode._he_is_wearing__2452b5aa-31da-48a1-b48a-10809e19c51c_2.png',
  '/imgs/Cont/bhauma108_A_surreal_fashion_editorial_portrait_of_a_figure_we_98023321-a27c-457c-8e08-1fa84fe1e8a5_0.png',
  '/imgs/Crystaline/bhauma108_Product_close-up_Photography_of_expensive_oversized_4e5692b4-5569-4089-8183-3f5a665fc5c2_1.png',
  '/imgs/Darling/bhauma108_a_minimalistic_leather_clutch_in_the_shape_of_an_ar_52803a6f-8ef1-41e5-af0d-5a46793517bf_2.png',
  '/imgs/Adria/bhauma108_close-up_of_hair_long_straight_brown_hair_blowing_i_1e99d3d8-119b-45e4-9aed-d9b97da01070_1.png',
  '/imgs/BoyZ/bhauma108_headshot_of_a_male_model_with_very_short_hair_shave_27667292-8a56-4f53-a509-6fa2b9ec13fc_0.png',
  '/imgs/Jawali/bhauma108_High-end_editorial_shoot_Of_a_Black_male_model_in_h_364c3a3b-1f02-40e3-8628-74aa3d1f242b_0.png',
  '/imgs/Malx/bhauma108_a_photo_of_an_ethereal_figure_wearing_an_oversized__8ccee650-d0df-4561-8017-ae28a6214c93_3.png',
  '/imgs/NS/bhauma108_A_striking_dance_shot_of_Latino_male_model_with_mus_41ae70c1-d750-464f-833c-0d1ebf64d2ad_2.png',
  '/imgs/Nike/bhauma108_A_high-fashion_editorial_portrait_of_an_elegant_bla_6338ce9d-7dd5-41f3-a4bd-b036925f9460_3.png',
  '/imgs/Red/bhauma108_editorial_photography_of_model_has_a_face_with_orna_4c3c4b04-2553-4afe-a685-e491ae6a40d3_0.png',
  '/imgs/Mskz/bhauma108_35mm_photo_of_a_woman_dressed_like_futuristic_queen_39dccdb4-e592-4783-83e0-9c0b4fd3ad98_3.png',
  '/imgs/Home/bhauma108_Editorial_fashion_portrait_shot__skinny_young_male__88935894-10b8-404e-878b-43de53d3512a_2.png',
  '/imgs/Home/IMG_1608.JPG',
  '/imgs/IMG_1127.JPG',
  '/imgs/IMG_1166.JPG',
  '/imgs/Home/bhauma108_High-end_editorial_shoot_Of_a_Black_male_model_in_h_364c3a3b-1f02-40e3-8628-74aa3d1f242b_2.png',
  '/imgs/Adria.JPG',
  '/imgs/Cont.JPG',
  '/imgs/Crystaline.JPG',
  '/imgs/Darling.PNG',
  '/imgs/Jawali.JPG',
  '/imgs/Malx.JPG',
  '/imgs/NS.JPG',
  '/imgs/Red.JPG',
  '/imgs/hero-editorial.png',
  '/imgs/bhauma108_editorial_photography_of_model_has_a_face_with_orna_0e34cda9-cdc0-46d1-b797-9700d116911f_1.png',
  '/imgs/nike.jpeg',
  '/imgs/Home/bhauma108_a_minimalistic_leather_clutch_in_the_shape_of_an_ar_79f71442-af54-45d4-bf6d-5abaa4b55342_2.png',
];

if (CLIENT_HOVER_IMAGES.length !== HOME_CLIENT_NAMES.length) {
  throw new Error(
    `CLIENT_HOVER_IMAGES (${CLIENT_HOVER_IMAGES.length}) must match HOME_CLIENT_NAMES (${HOME_CLIENT_NAMES.length})`,
  );
}
