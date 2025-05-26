import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit {
  private map!: L.Map;
  private userMarker: L.Marker | null = null;
  private locationMarker: L.Marker | null = null;
  private accuracyCircle: L.Circle | null = null;

  ngOnInit(): void {
    this.configureLeafletIcons();
    this.initMap();
  }

  ngOnDestroy(): void {
    this.clearMapLayers();
  }

  private configureLeafletIcons(): void {
    const iconDefault = L.icon({
      iconUrl: 'assets/icono/marker-icon.png',
      shadowUrl: 'assets/icono/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    L.Marker.prototype.options.icon = iconDefault;
  }
  private initMap(): void {
    this.map = L.map('map').fitWorld();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('locationfound', (e) => this.onLocationFound(e));
    this.map.locate({ setView: true, maxZoom: 16 });
  }

  private onLocationFound(e: L.LocationEvent): void {
    const radius = e.accuracy;

    // Limpiar marcadores y círculos anteriores
    this.clearLocationLayers();

    // Crear nuevo marcador de ubicación
    this.locationMarker = L.marker(e.latlng)
      .addTo(this.map)
      .bindPopup(
        `Estás dentro de un radio de ${radius} metros desde este punto`
      )
      .openPopup();

    // Crear círculo de precisión
    this.accuracyCircle = L.circle(e.latlng, {
      radius: radius,
      color: '#136AEC',
      fillColor: '#136AEC',
      fillOpacity: 0.15,
    }).addTo(this.map);
  }

  private clearLocationLayers(): void {
    if (this.locationMarker) {
      this.map.removeLayer(this.locationMarker);
      this.locationMarker = null;
    }
    if (this.accuracyCircle) {
      this.map.removeLayer(this.accuracyCircle);
      this.accuracyCircle = null;
    }
  }

  private clearMapLayers(): void {
    this.clearLocationLayers();
    if (this.userMarker) {
      this.map.removeLayer(this.userMarker);
      this.userMarker = null;
    }
  }

  getLocation(): void {
    if (!navigator.geolocation) {
      alert('Geolocalización no soportada');
      return;
    }

    const icono = L.icon({
      iconUrl: '../../assets/icono/geolocalizacion.png',
      iconSize: [25, 41],
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: L.LatLngTuple = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        if (this.userMarker) {
          this.map.removeLayer(this.userMarker);
        }

        this.userMarker = L.marker(coords, {
          icon: icono,
          draggable: true,
        })
          .addTo(this.map)
          .bindPopup('Estás aquí')
          .openPopup();

        this.userMarker.on('dragend', (event) => {
          const marker = event.target;
          const newPosition = marker.getLatLng();
          marker.setLatLng(newPosition).openPopup();
          this.map.setView(newPosition, 19);
          console.log(
            `Marcador movido a: ${newPosition.lat}, ${newPosition.lng}`
          );
        });

        this.map.setView(coords, 19);
      },
      (error) => {
        let errorMessage = 'No se pudo obtener la geolocalización';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso denegado por el usuario';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'La información de ubicación no está disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'La solicitud de ubicación expiró';
            break;
        }
        console.error('Error de geolocalización:', error);
        alert(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }
}
