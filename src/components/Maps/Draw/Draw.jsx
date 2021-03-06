import axios from 'axios'
import React, { useState } from 'react'
import { Marker, Polygon, Polyline, Popup } from 'react-leaflet'
import { Button, Input } from 'reactstrap'
import './styles.scss'

export default function Draw(props) {
  const { listDrawData, icon, username } = props
  const markers = []
  const polylines = []
  const polygons = []
  if (listDrawData) {
    for (let drawData of listDrawData.features) {
      if (drawData.properties.username === username) {
        if (drawData.geometry.type === 'Point') {
          markers.push({
            id: drawData.properties.id,
            mota: drawData.properties.mota,
            toado: drawData.geometry.coordinates,
          })
        } else if (drawData.geometry.type === 'LineString') {
          polylines.push({
            id: drawData.properties.id,
            mota: drawData.properties.mota,
            toado: drawData.geometry.coordinates,
          })
        } else if (drawData.geometry.type === 'Polygon') {
          polygons.push({
            id: drawData.properties.id,
            mota: drawData.properties.mota,
            toado: drawData.geometry.coordinates,
          })
        }
      }
    }
  }

  const [isEditDescription, setIsEditDescription] = useState(false)
  const [listIsDeleted, setListIsDeleted] = useState({})
  const [descriptionValue, setDescriptionValue] = useState('')
  const [justUpdated, setJustUpdated] = useState(false)
  const handleEditBtn = (mota) => {
    setIsEditDescription(!isEditDescription)
    setDescriptionValue(mota)
  }
  const handleSaveBtn = async (id) => {
    const updated = await axios
      .put(`http://localhost:8000/khac/${id}`, { mota: descriptionValue })
      .then(() => console.log('Draw Updated'))
      .catch((err) => console.log(err))
    setJustUpdated(true)
    setIsEditDescription(!isEditDescription)
  }
  const handleCancelBtn = () => {
    setIsEditDescription(!isEditDescription)
  }
  const handleDeleteBtn = async (id) => {
    const result = await axios
      .delete(`http://localhost:8000/khac/${id}`)
      .then(() => {
        setListIsDeleted({ ...listIsDeleted, [id]: true })
        console.log('Draw deleted')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  // const ref = useRef(null)

  // const closePopups = () => {
  //   mapRef.current.leafletElement.closePopup();
  // };

  return (
    <div>
      {markers !== [] &&
        markers.map(
          (marker, index) =>
            !listIsDeleted[marker.id] && (
              <Marker position={marker.toado} icon={icon} key={index}>
                <Popup>
                  {!isEditDescription &&
                    (justUpdated ? (
                      <p>{descriptionValue}</p>
                    ) : marker.mota === '' ? (
                      <p>Ch??a c?? m?? t???</p>
                    ) : (
                      <p>{marker.mota}</p>
                    ))}
                  {isEditDescription && (
                    <Input
                      type='text'
                      value={descriptionValue}
                      onInput={(e) => setDescriptionValue(e.target.value)}
                    />
                  )}
                  <div className='btn--container'>
                    {!isEditDescription && (
                      <Button onClick={() => handleEditBtn(marker.mota)}>S???a m?? t???</Button>
                    )}
                    {isEditDescription && (
                      <Button onClick={() => handleSaveBtn(marker.id)}>L??u</Button>
                    )}
                    {isEditDescription && <Button onClick={handleCancelBtn}>H???y</Button>}
                    <Button onClick={() => handleDeleteBtn(marker.id)}>X??a ??i???m</Button>
                  </div>
                </Popup>
              </Marker>
            ),
        )}
      {polylines !== [] &&
        polylines.map(
          (polyline, index) =>
            !listIsDeleted[polyline.id] && (
              <Polyline positions={polyline.toado} icon={icon} key={index}>
                <Popup>
                  {!isEditDescription &&
                    (justUpdated ? (
                      <p>{descriptionValue}</p>
                    ) : polyline.mota === '' ? (
                      <p>Ch??a c?? m?? t???</p>
                    ) : (
                      <p>{polyline.mota}</p>
                    ))}
                  {isEditDescription && (
                    <Input
                      type='text'
                      value={descriptionValue}
                      onInput={(e) => setDescriptionValue(e.target.value)}
                    />
                  )}
                  <div className='btn--container'>
                    {!isEditDescription && (
                      <Button onClick={() => handleEditBtn(polyline.mota)}>S???a m?? t???</Button>
                    )}
                    {isEditDescription && (
                      <Button onClick={() => handleSaveBtn(polyline.id)}>L??u</Button>
                    )}
                    {isEditDescription && <Button onClick={handleCancelBtn}>H???y</Button>}
                    <Button onClick={() => handleDeleteBtn(polyline.id)}>X??a ???????ng</Button>
                  </div>
                </Popup>
              </Polyline>
            ),
        )}
      {polygons !== [] &&
        polygons.map(
          (polygon, index) =>
            !listIsDeleted[polygon.id] && (
              <Polygon positions={polygon.toado} icon={icon} key={index}>
                <Popup>
                  {!isEditDescription &&
                    (justUpdated ? (
                      <p>{descriptionValue}</p>
                    ) : polygon.mota === '' ? (
                      <p>Ch??a c?? m?? t???</p>
                    ) : (
                      <p>{polygon.mota}</p>
                    ))}
                  {isEditDescription && (
                    <Input
                      type='text'
                      value={descriptionValue}
                      onInput={(e) => setDescriptionValue(e.target.value)}
                    />
                  )}
                  <div className='btn--container'>
                    {!isEditDescription && (
                      <Button onClick={() => handleEditBtn(polygon.mota)}>S???a m?? t???</Button>
                    )}
                    {isEditDescription && (
                      <Button onClick={() => handleSaveBtn(polygon.id)}>L??u</Button>
                    )}
                    {isEditDescription && <Button onClick={handleCancelBtn}>H???y</Button>}
                    <Button onClick={() => handleDeleteBtn(polygon.id)}>X??a v??ng</Button>
                  </div>
                </Popup>
              </Polygon>
            ),
        )}
    </div>
  )
}
