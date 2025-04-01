import React from "react";

/**
 * Component representing the assistant chat icon.
 * @param size The size of the icon
 */
function MistralChatIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      id="a"
      width={size}
      height={size}
      viewBox="0 0 298.24155 298.24154"
      version="1.1"
      className="fill-[#eb3a0b] text-white rounded-md"
    >
      <defs id="defs1"></defs>
      <rect id="rect2" width="298.24155" height="298.24155" x="0" y="0"></rect>
      <polygon
        points="242.424,90.909 242.424,121.212 212.121,121.212 212.121,151.515 181.818,151.515 181.818,121.212 151.515,121.212 151.515,90.909 121.212,90.909 121.212,212.121 90.909,212.121 90.909,242.424 181.818,242.424 181.818,212.121 151.515,212.121 151.515,181.818 181.818,181.818 181.818,212.121 212.121,212.121 212.121,181.818 242.424,181.818 242.424,212.121 212.121,212.121 212.121,242.424 303.03,242.424 303.03,212.121 272.727,212.121 272.727,90.909 "
        fill="currentColor"
        strokeWidth="0"
        id="polygon1"
        transform="translate(-47.848728,-17.545727)"
      ></polygon>
    </svg>
  );
}

export default MistralChatIcon;
