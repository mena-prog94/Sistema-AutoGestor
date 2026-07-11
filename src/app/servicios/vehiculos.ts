import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  // URL real de tu archivo PHP en tu servidor local
  private apiUrl = 'http://localhost/ProyectoFinal/vehiculos.php'; 

  constructor(private http: HttpClient) {}

  // Obtener todos los vehículos (GET)
  obtenerVehiculos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Guardar un vehículo (POST)
  guardarVehiculo(vehiculo: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, vehiculo);
  }

  // === NUEVO MÉTODO: ACTUALIZAR VEHÍCULO (PUT) ===
  // Envía los datos modificados al backend adjuntando el ID en la URL
  actualizarVehiculo(id: any, vehiculo: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?id=${id}`, vehiculo);
  }

  // === NUEVO MÉTODO: ELIMINAR VEHÍCULO (DELETE) ===
  // Envía una solicitud de borrado al backend pasando el ID en la URL
  eliminarVehiculo(id: any): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?id=${id}`);
  }
}