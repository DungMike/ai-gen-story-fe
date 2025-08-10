


  export enum VoiceOption {
    Zephyr = "Zephyr",
    Puck = "Puck",
    Charon = "Charon",
    Kore = "Kore",
    Fenrir = "Fenrir",
    Leda = "Leda",
    Orus = "Orus",
    Aoede = "Aoede",
    Callirrhoe = "Callirrhoe",
    Autonoe = "Autonoe",
    Enceladus = "Enceladus",
    Iapetus = "Iapetus",
    Umbriel = "Umbriel",
    Algieba = "Algieba",
    Despina = "Despina",
    Erinome = "Erinome",
    Algenib = "Algenib",
    Rasalgethi = "Rasalgethi",
    Laomedeia = "Laomedeia",
    Achernar = "Achernar",
    Alnilam = "Alnilam",
    Schedar = "Schedar",
    Gacrux = "Gacrux",
    Pulcherrima = "Pulcherrima",
    Achird = "Achird",
    Zubenelgenubi = "Zubenelgenubi",
    Vindemiatrix = "Vindemiatrix",
    Sadachbia = "Sadachbia",
    Sadaltager = "Sadaltager",
    Sulafat = "Sulafat",
  }
// mapping voices to options for UI
export const AUDIO_VOICES = Object.values(VoiceOption).map((voice) => ({
  value: voice,
  label: voice,
}));