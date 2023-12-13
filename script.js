const html = document.querySelector('html')
const focoBt = document.querySelector('.app__card-button--foco')
const curtoBt = document.querySelector('.app__card-button--curto')
const longoBt = document.querySelector('.app__card-button--longo')
const banner = document.querySelector('.app__image')
const titulo = document.querySelector('.app__title')
const botoes = document.querySelectorAll('.app__card-button')
const startPauseImg = document.querySelector('.app__card-primary-button-icon')
const startPauseBt = document.querySelector('#start-pause')
const btnComecarMusica = document.querySelector('.app__card-primary-button')
const musicaFocoInput = document.querySelector('#alternar-musica')
const tempoNaTela = document.querySelector('#timer')
const iniciarOuPausarBt = document.querySelector('#start-pause span')
const musica = new Audio('./sons/luna-rise-part-one.mp3')
musica.loop = true
const tempoFinalizadoAudio = new Audio('/sons/beep.mp3')
const pauseAudio = new Audio('/sons/pause.mp3')
const playAudio = new Audio('/sons/play.wav')

let tempoDecorridoEmSegundos = 1500
let intervaloId = null

musicaFocoInput.addEventListener('change', () => {
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos= 1500
    mudaContexto('foco')
    focoBt.classList.add('active')
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300
    mudaContexto('descanso-curto')
    curtoBt.classList.add('active')
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900
    mudaContexto('descanso-longo')
    longoBt.classList.add('active')
})

function mudaContexto (contexto) {
    mostrarTempo()
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active')
    })
    btnComecarMusica.classList.remove(`app__card-primary-button--foco`)
    btnComecarMusica.classList.remove(`app__card-primary-button--descanso-curto`)
    btnComecarMusica.classList.remove(`app__card-primary-button--descanso-longo`)
    html.setAttribute('data-contexto', contexto)
    banner.setAttribute('src', `/imagens/${contexto}.png`)
    btnComecarMusica.classList.add(`app__card-primary-button--${contexto}`)
    switch (contexto) {
        case 'foco':
            titulo.innerHTML = `
            Otimize sua produtividade, <strong class="app__title-strong">mergulhe no que importa.</strong>
                `
            break;
        case 'descanso-curto':
            titulo.innerHTML = `
            Que tal dar uma respirada? <strong class="app__title-strong"> Faça uma pausa curta! </strong>
            `
            break;
        case 'descanso-longo': 
            titulo.innerHTML = `
            Hora de voltar à superfície. <strong class="app__title-strong"> Faça uma pausa longa. </strong>
        `
        default:
            break;
    }
}

const contagemRegressiva = () => {
    if(tempoDecorridoEmSegundos <= 0) {
        tempoFinalizadoAudio.play()
        alert('Tempo Finalizado!')
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado')
            document.dispatchEvent(evento)
        }
        zerar()
        return
    }
    tempoDecorridoEmSegundos -= 1
    mostrarTempo()
}

startPauseBt.addEventListener('click', iniciarOuPausar)

function iniciarOuPausar() {
    if(intervaloId){
        pauseAudio.play()
        zerar()
        return
    }
    playAudio.play()
    intervaloId = setInterval(contagemRegressiva, 1000)
    iniciarOuPausarBt.textContent = "Pausar"
    startPauseImg.setAttribute('src', `/imagens/pause.png`)
}

function zerar() {
    clearInterval(intervaloId)
    iniciarOuPausarBt.textContent = "Começar"
    startPauseImg.setAttribute('src', '/imagens/play_arrow.png')
    intervaloId = null
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000)
    const tempoFormatado = tempo.toLocaleTimeString('pt-br', {minute: '2-digit', second: '2-digit'})
    tempoNaTela.innerHTML = `${tempoFormatado}`
}

mostrarTempo()