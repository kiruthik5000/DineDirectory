import React, { useState, useEffect } from 'react'
import Topbar from '../Single_Cards/Topbar'
import Content from '../Restaurant/Content'
import RestSkeleton from '../Restaurant/RestSkeleton'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import '../Restaurant/Rest2.css'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [allRestaurants, setAllRestaurants] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const nav= useNavigate() 
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/hotels')
        setAllRestaurants(res.data)
        setFilteredRestaurants(res.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchRestaurants()
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredRestaurants(allRestaurants)
    } else {
      const filtered = allRestaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.location.toLowerCase().includes(query.toLowerCase()) ||
        restaurant.theme.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredRestaurants(filtered)
    }
  }

  return (
    <>
      {/* ⭐ Added Logo Div */}
      <div className="logo" onClick={()=>nav('/')}> </div>

      <div style={{ padding: '20px 100px' }}>
        <TextField
          fullWidth
          placeholder="Search for restaurants by name, location, or theme"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{
            marginBottom: '20px',
            '& .MuiOutlinedInput-root': { borderRadius: '40px' }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'rgb(201, 42, 42)' }} />
              </InputAdornment>
            )
          }}
        />

        <div style={{ fontFamily: 'cursive', fontSize: '28px', marginBottom: '16px' }}>
          <span>{filteredRestaurants.length} Restaurants Found</span>
        </div>
      </div>

      {loading ? (
        <div className="contDisp">
          {Array.from({ length: 8 }, (_, i) => <RestSkeleton key={i} />)}
        </div>
      ) : (
        <div className="contDisp">
          {filteredRestaurants.map((val) => <Content key={val.id} data={val} />)}
        </div>
      )}
    </>
  )
}

export default Search
