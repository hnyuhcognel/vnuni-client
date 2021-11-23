import axios from 'axios'
import L from 'leaflet'
import React, { useEffect, useState } from 'react'
import { FeatureGroup, LayersControl, MapContainer, TileLayer } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import '../../leaflet/leaflet.css'
import Draw from './Draw/Draw'
import LocationMarker from './LocationMarker/LocationMarker'
import Minimap from './Minimap/Minimap'
import SchoolList from './SchoolList/SchoolList'
import SearchField from './Search/Search'
import './styles.scss'

function Maps(props) {
  const { distance, schoolList, handleFindByDistance, isFindByDistance, handleIsDrawing } = props
  const icon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconAnchor: [12, 40],
  })
  const redIcon = L.icon({
    iconUrl: 'https://chiangmaibuddy.com/wp-content/uploads/2015/12/1460972177-map_marker-red1.png',
    iconAnchor: [18, 39],
    iconSize: [34.5, 40],
  })

  const [drawData, setDrawData] = useState({
    type: '',
    coordinates: [],
    mota: '',
  })

  const [listDrawData, setListDrawData] = useState()

  const handleLine = (e) => {
    if (e.layerType === 'rectangle' || e.layerType === 'polygon') {
      let latlngs = []
      for (let latlng of e.layer._latlngs[0]) {
        latlngs.push([latlng.lat, latlng.lng])
      }
      latlngs.push(latlngs[0])
      setDrawData({
        ...drawData,
        type: 'Polygon',
        coordinates: [latlngs],
      })
    } else if (e.layerType === 'polyline') {
      let latlngs = []
      for (let latlng of e.layer._latlngs) {
        latlngs.push([latlng.lat, latlng.lng])
      }
      setDrawData({
        ...drawData,
        type: 'LineString',
        coordinates: latlngs,
      })
    } else if (e.layerType === 'marker') {
      setDrawData({
        ...drawData,
        type: 'Point',
        coordinates: [e.layer._latlng.lat, e.layer._latlng.lng],
      })
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      const result1 = await axios
        .post('http://localhost:8000/khac', drawData)
        .then(() => {
          console.log('Draw saved')
        })
        .catch((err) => {
          console.error(err)
        })
      const result2 = await axios
        .get('http://localhost:8000/khac')
        .then((result) => {
          // console.log(result.data)
          setListDrawData(result.data)
        })
        .catch((err) => console.log(err))
    }
    fetchData()
  }, [drawData])

  return (
    <div className='map-container'>
      <MapContainer
        center={[13.75922020532489, 109.21785730217843]}
        zoom={5}
        scrollWheelZoom={true}
        // closePopupOnClick={false}
      >
        <SearchField />
        <LayersControl position='topright'>
          <LayersControl.BaseLayer checked name='OpenStreetMap - Mapnik'>
            <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name='OpenStreetMap - BlackAndWhite'>
            <TileLayer url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png' />
          </LayersControl.BaseLayer>
        </LayersControl>
        <FeatureGroup>
          <EditControl
            position='topleft'
            onDrawStart={() => {
              handleIsDrawing(true)
              handleFindByDistance()
            }}
            // onCreated={(e) => handleLine(e)}
            onCreated={async (e) => {
              const save = await handleLine(e)
              const deleteLayer = await e.layer.remove()
              const confirm = await console.log('del layer')
            }}
            onDrawStop={() => handleIsDrawing(false)}
            edit={{ edit: false, remove: false }}
            draw={{ marker: { icon: icon }, circle: false, circlemarker: false }}
          />
        </FeatureGroup>
        <SchoolList icon={icon} schoolList={schoolList} />
        <Draw listDrawData={listDrawData} icon={icon} />
        <Minimap position='bottomright' zoom='4' />
        <LocationMarker
          icon={redIcon}
          schoolList={schoolList}
          distance={distance}
          isFindByDistance={isFindByDistance}
        />
      </MapContainer>
    </div>
  )
}

Maps.propTypes = {}

export default Maps
