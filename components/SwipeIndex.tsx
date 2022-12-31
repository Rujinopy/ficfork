import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper";
// Import Swiper styles
import "swiper/css";


export default function SwiperIndex() {
  return (
    <>
      <Swiper className="mySwiper"
       spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 1,
              spaceBetween: 50,
            },
          }}
        >
        <SwiperSlide>
            <img className="w-full" src="https://comicvine.gamespot.com/a/uploads/scale_small/6/67663/3182355-09.jpg" alt="Sunset in the mountains"/>
        </SwiperSlide>
        <SwiperSlide>
        <img className="w-full" src="https://i.pinimg.com/originals/f7/91/31/f79131d3bd7d34cf9969a1778310e5d4.jpg" alt="Sunset in the mountains"/>
        </SwiperSlide>
        <SwiperSlide>
        <img className="w-full" src="https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421510439/bleach-vol-19-9781421510439_hr.jpg" alt="Sunset in the mountains"/>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

