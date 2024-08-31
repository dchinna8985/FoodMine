import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LocationService } from '../../../services/location.service';
import { LatLng, LatLngExpression, LeafletMouseEvent } from 'leaflet';
import { Order } from '../../../shared/models/Order';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnChanges {

  @Input()
  order!: Order;
  @Input()
  readonly = false;

  private readonly MARKER_ZOOM_LEVEL = 16;
  private readonly DEFAULT_LATLNG = [13.75, 21.62] as [number, number];

  @ViewChild('map', { static: true }) mapRef!: ElementRef;

  map: any;
  currentMarker: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private locationService: LocationService
  ) {}

  ngOnChanges(): void{
    if(isPlatformBrowser(this.platformId)) {
      if(!this.order) return;
      this.initializeMap();

      if(this.readonly && this.addressLatLng){
        this.showLocationOnReadonlyMode();
      }
    }
  }

  private destroyMap() {
    if (this.map) {
      this.map.off();  // Remove event listeners
      this.map.remove();  // Remove the map from the DOM
    }
  }


  showLocationOnReadonlyMode() {
    if(isPlatformBrowser(this.platformId)){
      const m = this.map;
      this.setMarker(this.addressLatLng);
      m.setView(this.addressLatLng, this.MARKER_ZOOM_LEVEL);

      m.dragging.disable();
      m.touchZoom.disable();
      m.doubleClickZoom.disable();
      m.scrollWheelZoom.disable();
      m.boxZoom.disable();
      m.keyboard.disable();
      m.off('click');
      m.tap?.disable();
      this.currentMarker.dragging?.disable();
    }

  }

  private async initializeMap(): Promise<void> {
    if (this.map) {
      this.destroyMap();  // Destroy the existing map if it exists
    }
    const L = await import('leaflet');
    this.map = L.map(this.mapRef.nativeElement, {
      attributionControl: false,
      center: this.DEFAULT_LATLNG,
      zoom: 1,
    });

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.on('click', (e:LeafletMouseEvent) => {
      this.setMarker(e.latlng);
    })

    const MARKER_ICON = L.icon({
      iconUrl: 'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
      iconSize: [42, 42],
      iconAnchor: [21, 42],
    });

    this.currentMarker = L.marker(this.DEFAULT_LATLNG, {
      draggable: true,
      icon: MARKER_ICON,
    }).addTo(this.map);
  }

  findMyLocation(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.locationService.getCurrentLocation().subscribe({
        next: (latlng) => {
          this.map.setView(latlng, this.MARKER_ZOOM_LEVEL);
          this.setMarker(latlng);
        }
      });
    }
  }

  setMarker(latlng:LatLngExpression): void {

    this.addressLatLng = latlng as LatLng;

    if (isPlatformBrowser(this.platformId)) {
      if (this.currentMarker) {
        this.currentMarker.setLatLng(latlng);
      } else {
        const L = (window as any).L; // Access L globally if needed
        const MARKER_ICON = L.icon({
          iconUrl: 'https://res.cloudinary.com/foodmine/image/upload/v1638842791/map/marker_kbua9q.png',
          iconSize: [42, 42],
          iconAnchor: [21, 42],
        });

        this.currentMarker = L.marker(latlng, {
          draggable: true,
          icon: MARKER_ICON,
        }).addTo(this.map);

        this.currentMarker.on('dragend', () => {
          this.addressLatLng = this.currentMarker.getLatLng();
        })
      }
    }
  }

  set addressLatLng(latlng: LatLng){

    if(!latlng.lat.toFixed) return;

    latlng.lat = parseFloat(latlng.lat.toFixed(8));
    latlng.lng = parseFloat(latlng.lng.toFixed(8));
    this.order.addressLatLng = latlng;
    console.log(this.order.addressLatLng);
  }

  get addressLatLng(){
    return this.order.addressLatLng!;
  }
}
