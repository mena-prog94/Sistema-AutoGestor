import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth'; // Asegúrate de que la ruta apunte bien a tu archivo de servicio
import { addIcons } from 'ionicons';
import { personAddOutline, personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonicModule, 
    RouterModule
  ]
})
export class RegisterPage {
  name = '';
  email = '';
  password = '';

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService 
  ) {
    addIcons({ 
      'person-add-outline': personAddOutline,
      'person-outline': personOutline,
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline
    });
  }

  async onRegister() {
    const trimmedName = this.name.trim();
    const trimmedEmail = this.email.trim();
    const trimmedPassword = this.password.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPassword) {
      this.presentToast('Por favor, rellena todos los campos.', 'warning');
      return;
    }

    // Estructuramos el payload enviando tanto el formato en español como en inglés
    // para garantizar compatibilidad total con el mapeo unificado de tu register.php
    const userData = {
      usuario: trimmedName,
      username: trimmedName,
      correo: trimmedEmail,
      email: trimmedEmail,
      clave: trimmedPassword,
      password: trimmedPassword
    };

    // Consumimos el método register con tipado explícito para evitar error TS7006
    this.authService.register(userData).subscribe({
      next: async (response: any) => { 
        if (response && response.success) {
          this.presentToast(response.message || '¡Registro exitoso! Ya puedes iniciar sesión.', 'success');
          this.router.navigate(['/login']);
        } else {
          this.presentToast(response.message || 'Error al registrar el usuario.', 'danger');
        }
      },
      error: async (error: any) => { 
        console.error('Error de red/servidor:', error);
        this.presentToast('Error de conexión con el servidor.', 'danger');
      }
    });
  }

  async presentToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}