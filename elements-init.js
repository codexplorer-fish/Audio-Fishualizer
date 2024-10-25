const uiContainer = document.getElementById('uiContainer')
const canvasEscapeContainer = document.getElementById('canvasEscapeContainer')
const canvas = document.getElementById('canvas1')

const animationSidebarImg = document.getElementById('animationSidebarImg')
const colorSidebarImg = document.getElementById('colorSidebarImg')
const analyserSidebarImg = document.getElementById('analyserSidebarImg')
const animationSidebar = document.getElementById('animationSidebar')
const colorSidebar = document.getElementById('colorSidebar')
const analyserSidebar = document.getElementById('analyserSidebar')
const mainSidebar = document.getElementById('mainSidebar')

const dynamicAnimationSlidersContainer = document.getElementById('dynamicAnimationSlidersContainer')
const dynamicColorSlidersContainer = document.getElementById('dynamicColorSlidersContainer')
const dynamicAnalyserSlidersContainer = document.getElementById('dynamicAnalyserSlidersContainer')

const muteButton = document.getElementById('mute')
const sourceSlider = document.getElementById('sourceSlider')
const channelButton = 0
const audioElement = document.getElementById('audioElement')
const audioFileInput = document.getElementById('audioUpload')
const popupButton = document.getElementById('popup')

const animationStyleSlider = document.getElementById('animationStyleSlider')
const colorStyleSlider = document.getElementById('colorStyleSlider')
const analyserStyleSlider = document.getElementById('analyserStyleSlider')

const animationColorScaleSlider = document.getElementById('animationColorScaleSlider')
const animationColorBaseSlider = document.getElementById('animationColorBaseSlider')
const animationColorCompressionSlider = document.getElementById('animationColorCompressionSlider')
const animationColorShiftSlider = document.getElementById('animationColorShiftSlider')
const animationColorFadeSlider = document.getElementById('animationColorFadeSlider')
const animationColorLightSlider = document.getElementById('animationColorLightSlider')

const analyserFftValueSlider = document.getElementById('analyserFftValueSlider')
const analyserDbMinSlider = document.getElementById('analyserDbMinSlider')
const analyserDbMaxSlider = document.getElementById('analyserDbMaxSlider')
const analyserSmoothnessSlider = document.getElementById('analyserSmoothnessSlider')

const dynamicTextContainers = document.getElementsByClassName('dynamicTextContainer')
let dynamicAnimationSliders = []
let dynamicColorSliders = []
let dynamicAnalyserSliders = []
let animationResetStyle = true
let colorResetStyle = true
let allLastSettingsPreset = {} // Is the last set values of every setting set during the session. Used to auto-fill style values when style changes

const presetSaver = document.getElementById('presetSaver')
const presetReplacer = document.getElementById('presetReplacer')
const presetDeleter = document.getElementById('presetDeleter')
const presetSlider = document.getElementById('presetSlider')
const presetNameInput = document.getElementById('presetNameInput')