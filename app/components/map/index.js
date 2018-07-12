
import React from 'react';
import './index.css';
class MapComponent extends React.Component{
    constructor(props){
        super(props);
        this.ref = null;
        this.createMap = this.createMap.bind(this);
        this.createGeocoder = this.createGeocoder.bind(this);
        this.geocoderLatLng = this.geocoderLatLng.bind(this);
        this.geocoderAddress = this.geocoderAddress.bind(this);
        this.attachClickEvent = this.attachClickEvent.bind(this);
        this.autoComplete = this.autoComplete.bind(this);
    }
    render(){
        return (
            <div className="map" ref={(r) => this.ref = r}/>
        )
    }
    componentDidMount(){
        if(this.ref){
            this.createMap(this.props);
            this.createGeocoder();
            this.attachClickEvent();
            this.geocoderLatLng(this.props);
        }
    }
    componentWillReceiveProps(nextProps){
        const that = this;
        const { lat, lng, bigAddress, inputElement} = nextProps;
        this.autoComplete(inputElement,bigAddress);
        if(lat !== that.props.lat || lng !== that.props.lng){
            that.createMap({lat, lng});
            that.geocoderLatLng({lat, lng});
        }
    }
    componentWillUnmount(){
        const that = this;
        qq.maps.event.removeListener(that.attachClickMapEvent);
        qq.maps.event.removeListener(that.attachInputElementEvent);
    }
    //创建地图
    createMap({ lat, lng }){
        const that = this;
        let option = {
            lat,
            lng,
            zoom: 15
        };
        if(!lat || !lng){
            option = {
                lat: 23.124663,
                lng: 113.36199,
                zoom: 11
            }
        }
        this.mapInstance = new qq.maps.Map(that.ref, {
            center: new qq.maps.LatLng(option.lat, option.lng),
            zoom: option.zoom
        });
    }
    createGeocoder(){
        //地址检索，从地址到经纬度，或者从经纬度到地址
        this.geocoder = new qq.maps.Geocoder();
        this.geocoder.setError((error) => {
           console.log(error);
        });
    }
    //地址检索，从地址到经纬度
    geocoderAddress(address){
        const that = this;
        that.geocoder.getLocation(address);
        that.geocoder.setComplete((result) => {
            that.mapInstance.setCenter(result.detail.location);
            if(that.marker){
                that.marker.setMap(null);
            }
            that.marker = new qq.maps.Marker({
                map: that.mapInstance,
                draggable: true,
                position: result.detail.location
            });
            that.attachMarkerDragEvent();
            that.props.getLatLng(result.detail.location);
        });
    }
    //地址检索，从经纬度到地址
    geocoderLatLng({lat, lng}){
        const that = this;
        let latLng = new qq.maps.LatLng(lat, lng);
        that.geocoder.getAddress(latLng);
        that.geocoder.setComplete((result) => {
            that.mapInstance.setCenter(result.detail.location);
            if(that.marker){
                that.marker.setMap(null);
            }
            that.marker = new qq.maps.Marker({
                map: that.mapInstance,
                draggable: true,
                position: result.detail.location
            });
            that.attachMarkerDragEvent();
            that.props.getLatLng(result.detail.location);
        });
    }
    attachClickEvent(){
        const that = this;
        this.attachClickMapEvent = qq.maps.event.addListener(that.mapInstance, 'click', function(event){
            if(that.marker) {that.marker.setMap(null);}
            that.marker = new qq.maps.Marker({
                position: event.latLng,
                draggable: true,
                map: that.mapInstance
            });
            that.geocoderLatLng(event.latLng);
        });
    }
    attachMarkerDragEvent(){
        const that = this;
        qq.maps.event.addListener(that.marker, 'dragend', () => {
            that.props.getLatLng(that.marker.getPosition());
        });
    }
    autoComplete(mountPoint,bigAddress){
        const that = this;
        if(!that.autoCompleteInstance || bigAddress !== that.props.bigAddress){
            that.autoCompleteInstance = new qq.maps.place.Autocomplete(mountPoint, {
                location: bigAddress
            });
            that.attachInputElementEvent = qq.maps.event.addListener(that.autoCompleteInstance, 'confirm', (res) => {
                that.geocoderAddress(bigAddress + res.value);
                if(that.props.getSmallAddress){
                    that.props.getSmallAddress(res.value);
                }
            });
        }
    }
}
export default MapComponent;
