import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Importa IonicModule

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true, // Asegúrate de que el componente sea standalone
  imports: [IonicModule], // Importa IonicModule aquí
})
export class HomePage {
  private audioContext: AudioContext;
  private mediaStream!: MediaStream; // Usa el operador ! para indicar que se inicializará más tarde
  private sourceNode!: MediaStreamAudioSourceNode;
  private delayNode!: DelayNode;
  private gainNode!: GainNode;

  constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async startAudio() {
    try {
      // Obtener acceso al micrófono
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Crear un nodo de fuente de audio desde el micrófono
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);

      // Crear un nodo de retraso (delay) de 3 segundos
      this.delayNode = this.audioContext.createDelay(3); // 3 segundos de retraso
      this.delayNode.delayTime.setValueAtTime(3, this.audioContext.currentTime);

      // Crear un nodo de ganancia (volumen)
      this.gainNode = this.audioContext.createGain();
      this.gainNode.gain.setValueAtTime(1, this.audioContext.currentTime); // Volumen al 100%

      // Conectar los nodos: micrófono -> delay -> ganancia -> salida
      this.sourceNode.connect(this.delayNode);
      this.delayNode.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      console.log('Audio iniciado con un retraso de 3 segundos');
    } catch (error) {
      console.error('Error al acceder al micrófono:', error);
    }
  }

  stopAudio() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop()); // Detener el micrófono
    }
    if (this.audioContext) {
      this.audioContext.close(); // Cerrar el contexto de audio
    }
    console.log('Audio detenido');
  }
}
