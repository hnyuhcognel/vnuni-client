import { faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useRef, useState, useEffect } from 'react'
import { Marker, Popup } from 'react-leaflet'
import { Button, Input, Label } from 'reactstrap'
import Comment from './Comment/Comment'
import './styles.scss'
import axios from 'axios'
import jwtDecode from 'jwt-decode'

export default function SchoolList(props) {
  const {
    icon,
    onShow,
    handleSetIsEditingSchool,
    handleSetIdSchoolEditing,
    justAddSchool,
    schoolList,
    handleSetJustDeletedSchool,
    justDeletedSchool,
  } = props

  const tokenLocal = localStorage.getItem('token')
  const tokenDecoded = jwtDecode(tokenLocal)

  const [isRate, setIsRate] = useState(false)
  const [isEditRate, setIsEditRate] = useState(false)
  const [colorTheStars, setColorTheStars] = useState(0)
  const [ratedStarsAmount, setRatedStarAmount] = useState(0)
  const [commentRated, setCommentRated] = useState('')
  const [picturesRated, setPicturesRated] = useState({})
  const [idRated, setIdRated] = useState()

  const handleRate = async (id_truong) => {
    if (ratedStarsAmount === 0) {
      alert('Vui lòng chọn số sao!')
      return
    }

    let config = {
      headers: {
        Authorization: tokenLocal,
        'Content-Type': 'multipart/form-data',
      },
    }
    let picturesRatedArray = picturesRated !== {} && Object.values(picturesRated)

    let formData = new FormData()
    formData.append('id_truong', id_truong)
    formData.append('sao', ratedStarsAmount)
    commentRated !== '' && formData.append('danh_gia', commentRated)
    picturesRated !== {} &&
      picturesRatedArray.forEach((picture) => {
        formData.append('hinh_anh', picture, picture.name)
      })

    try {
      const result = await axios.post('http://localhost:8000/danhgia', formData, config)
      console.log(result)
      setIsRate(false)
      setCommentRated('')
      setRatedStarAmount(0)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSetIsEditRate = (bool) => {
    setIsEditRate(bool)
  }
  const handleSetRatedStarAmount = (stars) => {
    setRatedStarAmount(stars)
  }
  const handleSetCommentRated = (comment) => {
    setCommentRated(comment)
  }
  const handleSetIdRated = (id) => {
    setIdRated(id)
  }

  const handleEditRate = async () => {
    await axios.put(
      `http://localhost:8000/danhgia/${idRated}`,
      {
        sao: ratedStarsAmount,
        danh_gia: commentRated,
      },
      { headers: { Authorization: localStorage.getItem('token') } },
    )
    console.log('edited')
    setIsEditRate(false)
    setRatedStarAmount(0)
    setCommentRated('')
  }

  const popupRef = useRef()

  const handleEditSchool = (school_id) => {
    handleSetIsEditingSchool(true)
    handleSetIdSchoolEditing(school_id)
    popupRef.current._close()
    onShow()
  }
  // const [schoolListState, setSchoolListState] = useState()
  // useEffect(() => {
  //   const handleSetSchoolListState = async () => {
  //     try {
  //       const result = await axios('http://localhost:8000/truong')
  //       setSchoolListState(result.data.data)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   handleSetSchoolListState()
  // }, [justAddSchool, justDeletedSchool])

  const handleDeleteSchool = async (id_truong) => {
    try {
      await axios.delete(`http://localhost:8000/truong/${id_truong}`, {
        headers: { Authorization: localStorage.getItem('token') },
      })
      handleSetJustDeletedSchool()
      console.log('deleted')
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      {schoolList &&
        schoolList.map((school, index) => {
          return (
            <Marker position={[school.lat, school.long]} icon={icon} key={index}>
              <Popup
                ref={popupRef}
                className='school-popup'
                maxWidth='500px'
                autoClose={false}
                autoPan
                keepInView
              >
                <p className='school-title'>{school.tentruong}</p>
                {!isRate && !isEditRate && (
                  <div className='rated-star'>
                    <p className='average-star'>{school.sao === null ? '#' : school.sao}</p>
                    <FontAwesomeIcon className='star-icon' icon={faStarSolid} />
                  </div>
                )}
                {!isRate && !isEditRate && <p id='description'>{school.mo_ta}</p>}

                {(isRate || isEditRate) && (
                  <div className='send-stars'>
                    <Button
                      onClick={() => {
                        setRatedStarAmount(1)
                      }}
                    >
                      <FontAwesomeIcon
                        onMouseOver={() => setColorTheStars(1)}
                        onMouseOut={() => setColorTheStars(0)}
                        className='star-icon'
                        icon={
                          colorTheStars >= 1 || ratedStarsAmount >= 1 ? faStarSolid : faStarRegular
                        }
                      />
                    </Button>
                    <Button
                      onClick={() => {
                        setRatedStarAmount(2)
                      }}
                    >
                      <FontAwesomeIcon
                        onMouseOver={() => setColorTheStars(2)}
                        onMouseOut={() => setColorTheStars(0)}
                        className='star-icon'
                        icon={
                          colorTheStars >= 2 || ratedStarsAmount >= 2 ? faStarSolid : faStarRegular
                        }
                      />
                    </Button>
                    <Button
                      onClick={() => {
                        setRatedStarAmount(3)
                      }}
                    >
                      <FontAwesomeIcon
                        onMouseOver={() => setColorTheStars(3)}
                        onMouseOut={() => setColorTheStars(0)}
                        className='star-icon'
                        icon={
                          colorTheStars >= 3 || ratedStarsAmount >= 3 ? faStarSolid : faStarRegular
                        }
                      />
                    </Button>
                    <Button
                      onClick={() => {
                        setRatedStarAmount(4)
                      }}
                    >
                      <FontAwesomeIcon
                        onMouseOver={() => setColorTheStars(4)}
                        onMouseOut={() => setColorTheStars(0)}
                        className='star-icon'
                        icon={
                          colorTheStars >= 4 || ratedStarsAmount >= 4 ? faStarSolid : faStarRegular
                        }
                      />
                    </Button>
                    <Button
                      onClick={() => {
                        setRatedStarAmount(5)
                      }}
                    >
                      <FontAwesomeIcon
                        onMouseOver={() => setColorTheStars(5)}
                        onMouseOut={() => setColorTheStars(0)}
                        className='star-icon'
                        icon={
                          colorTheStars >= 5 || ratedStarsAmount >= 5 ? faStarSolid : faStarRegular
                        }
                      />
                    </Button>
                  </div>
                )}
                {(isRate || isEditRate) && (
                  <div className='send-comment'>
                    {isEditRate && (
                      <Input
                        name='danh_gia'
                        type='textarea'
                        placeholder='Đánh giá của bạn'
                        onChange={(e) => setCommentRated(e.target.value)}
                        // onBlur={(e) => setCommentRated(e.target.value)}
                        value={commentRated !== '' ? commentRated : null}
                      />
                    )}
                    {isRate && (
                      <Input
                        name='danh_gia'
                        type='textarea'
                        placeholder='Đánh giá của bạn'
                        // onChange={(e) => setCommentRated(e.target.value)}
                        onBlur={(e) => setCommentRated(e.target.value)}
                        value={commentRated !== '' ? commentRated : null}
                      />
                    )}
                    {!isEditRate && <Label for='hinh_anh'>Đính kèm ảnh:</Label>}
                    {!isEditRate && (
                      <Input
                        id='hinh_anh'
                        name='hinh_anh'
                        type='file'
                        accept='.jpg, .png'
                        multiple
                        onChange={(e) => setPicturesRated({ ...e.target.files })}
                      />
                    )}
                  </div>
                )}
                <div className='school__button--container'>
                  {!isRate && !isEditRate && (
                    <Button onClick={() => setIsRate(true)}>Gửi đánh giá</Button>
                  )}
                  {tokenDecoded.role === 'admin' && !isRate && !isEditRate && (
                    <Button onClick={() => handleEditSchool(school.id_truong)}>Sửa trường</Button>
                  )}
                  {isRate && <Button onClick={() => handleRate(school.id_truong)}>Đánh giá</Button>}
                  {isEditRate && <Button onClick={handleEditRate}>Xác nhận</Button>}
                  {(isRate || isEditRate) && (
                    <Button
                      onClick={() => {
                        setIsRate(false)
                        setIsEditRate(false)
                        setRatedStarAmount(0)
                        setCommentRated('')
                      }}
                    >
                      Hủy
                    </Button>
                  )}
                  {tokenDecoded.role === 'admin' && (
                    <Button onClick={() => handleDeleteSchool(school.id_truong)}>Xóa trường</Button>
                  )}
                </div>
                {!isRate && !isEditRate && (
                  <Comment
                    handleSetIsEditRate={handleSetIsEditRate}
                    handleSetRatedStarAmount={handleSetRatedStarAmount}
                    handleSetCommentRated={handleSetCommentRated}
                    handleSetIdRated={handleSetIdRated}
                    schoolId={school.id_truong}
                  />
                )}
              </Popup>
            </Marker>
          )
        })}
    </div>
  )
}
