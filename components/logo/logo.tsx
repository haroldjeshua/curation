import { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={200}
      height={200}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M199.06 140.014C199.605 145.51 195.075 150 189.552 150H153.302C147.779 150 143.42 145.463 142.173 140.083C137.681 120.698 120.304 106.25 99.5522 106.25C78.8007 106.25 61.4237 120.698 56.931 140.083C55.6841 145.463 51.325 150 45.8022 150H9.55217C4.02932 150 -0.500355 145.51 0.0445342 140.014C5.0553 89.4741 47.6939 50 99.5522 50C151.41 50 194.049 89.4741 199.06 140.014Z"
        fill="url(#paint0_linear_104_151)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_104_151"
          x1={156.795}
          y1={66}
          x2={111.742}
          y2={157.282}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset={0.0509862} stopColor="#FFB6E1" />
          <stop offset={1} stopColor="#FBE3EA" />
        </linearGradient>
      </defs>
    </svg>
  );
}
