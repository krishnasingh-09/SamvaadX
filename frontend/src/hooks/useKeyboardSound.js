// audio setup
const keyStrokeSounds = [
  new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/SamvaadX/frontend/public/sounds/keystroke1-JXckZGSvcIc85nrCAT29k9kXm9LKTv.mp3"),
  new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/SamvaadX/frontend/public/sounds/keystroke2-RGnTaRDBkqKM8cD1OwY02yAINhak5m.mp3"),
  new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/SamvaadX/frontend/public/sounds/keystroke3-UdloJGrHee84sVSUCajT6JngjQeLyE.mp3"),
  new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/SamvaadX/frontend/public/sounds/keystroke4-ZlKXlOFY8aG2WbIuUmNRBmkbJpO8ET.mp3"),
];

function useKeyboardSound() {
  const playRandomKeyStrokeSound = () => {
    const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

    randomSound.currentTime = 0; // this is for a better UX, def add this
    randomSound.play().catch((error) => console.log("Audio play failed:", error));
  };

  return { playRandomKeyStrokeSound };
}

export default useKeyboardSound;




// // audio setup
// const keyStrokeSounds = [
//   new Audio("/sounds/keystroke1.mp3"),
//   new Audio("/sounds/keystroke2.mp3"),
//   new Audio("/sounds/keystroke3.mp3"),
//   new Audio("/sounds/keystroke4.mp3"),
// ];

// function useKeyboardSound() {
//   const playRandomKeyStrokeSound = () => {
//     const randomSound = keyStrokeSounds[Math.floor(Math.random() * keyStrokeSounds.length)];

//     randomSound.currentTime = 0; // this is for a better UX, def add this
//     randomSound.play().catch((error) => console.log("Audio play failed:", error));
//   };

//   return { playRandomKeyStrokeSound };
// }

// export default useKeyboardSound;
