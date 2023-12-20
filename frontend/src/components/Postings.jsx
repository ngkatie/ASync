import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployerCard from './EmployerCard';
import Navbar from './Navbar';
import { Box, Button, Pagination, Stack, Typography, TextField } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostingCard from './PostingCard';
import PostingDetailsModal from './PostingDetailsModal';

function Postings() {
  let { page } = useParams();
  page = Number(page);

  const [postings, setPostings] = useState([]);
  const [allPostings, setAllPostings] = useState([]);
  const [numberOfTotalPostings, setNumberOfTotalPostings] = useState(0);
  const [currentSelectedPostingId, setCurrentSelectedPostingId] = useState('');
  const [currentSelectedPosting, setCurrentSelectedPosting] = useState({});
  const [startingIndex, setStartingIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [searchInput, setSearchInput] = useState('');
  const [finalSearch, setFinalSearch] = useState('');

  const navigate = useNavigate();

  //postings for the page in postings
  //all postings can be in new state
  //split postings every time page changes

  useEffect(() => {
    async function fetchData() {
      if (isNaN(page) || page < 1) {
        navigate('/400');
        return;
      }

      try {
        // Include the search parameter in the URL
        let url = 'http://localhost:3000/api/postings';
        if (searchInput) {
          url += `?search=${searchInput}`;
        }
        
        console.log(url);
        let postingList = await axios.get(url);
        setAllPostings(postingList.data);
  
        if (postingList.data.length !== 0) {
          setCurrentSelectedPostingId(postingList.data[0]._id);
        }
  
        setNumberOfTotalPostings(postingList.data.length);
        let index = (page - 1) * 10;
        setStartingIndex(index);
        setPostings(postingList.data.slice(index, index + 10));
      } catch (e) {
        alert(e);
        navigate('/404');
      }
    }
  
    fetchData();
  }, [page, finalSearch]);
  
  useEffect(() => {
    // Page change logic
    let index = (currentPage - 1) * 10;
    setStartingIndex(index);
    setPostings(allPostings.slice(index, index + 10));
  }, [currentPage, allPostings]);

  const currentUserState = useSelector((state) => state.user);

  useEffect(() => {
    console.log(currentUserState);
  }, [currentUserState]);

  useEffect(() => {
    async function fetchData() {
      try {
        if (postings.length !== 0) {
          let posting = await axios.get(
            `http://localhost:3000/api/postings/${currentSelectedPostingId}`
          );
          setCurrentSelectedPosting(posting.data);
          console.log(posting.data);
        }
      } catch (e) {
        alert(e);
      }
    }
    fetchData();
  }, [currentSelectedPostingId]);

  const handlePageChange = (e, newPage) => {
    setCurrentPage(newPage);
    navigate(`/postings/page/${newPage}`);
  };

  const hidePrevButton = page === 1;
  const hideNextButton = numberOfTotalPostings - startingIndex <= 10;

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 11 }}>
        <Typography sx={{color: "black"}}>Search based on Title, Description, Company, State, City, Skills, or Job Type!</Typography>
        <TextField
          type="text"
          placeholder="Search..."
          value={searchInput}
          required
          onChange={(e) => setSearchInput(e.target.value)}
          sx={{width: "400px"}}
        />
        <Button
          variant="contained"
          onClick={() => setFinalSearch(searchInput)}
          sx={{height: "55px", ml: 1, width: "200px"}}
        >
          Search
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgb(200,200,200)',
          padding: '10px',
          borderRadius: 5,
          width: '100%',
          mt: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            ml: 5,
          }}
        >
          {postings && postings.length !== 0 ? (
            <Pagination
              count={Math.ceil(numberOfTotalPostings / 10)}
              page={currentPage}
              onChange={handlePageChange}
              hidePrevButton={hidePrevButton}
              hideNextButton={hideNextButton}
              showFirstButton
              showLastButton
              sx={{ mb: 3, mt: 3 }}
              color='primary'
            />
          ) : (
            <Typography>No postings available yet!</Typography>
          )}
          <Box
            sx={{
              minHeight: 600,
              maxHeight: 650,
              overflowY: 'auto',
              p: 2,
            }}
          >
            {postings &&
              postings.map((posting) => (
                // <Link to={`/postings/${posting._id}`} key={posting._id}>
                <PostingCard
                  key={posting._id}
                  postingId={posting._id}
                  jobTitle={posting.jobTitle}
                  companyName={posting.companyName}
                  companyLogo={posting.companyLogo}
                  jobType={posting.jobType}
                  numOfEmployees={posting.numOfEmployees}
                  description={posting.description}
                  pay={posting.pay}
                  rate={posting.rate}
                  applicants={posting.applicants}
                  skills={posting.skills}
                  city={posting.city}
                  state={posting.state}
                  postedDate={posting.postedDate}
                  setCurrentSelectedPostingId={setCurrentSelectedPostingId}
                />
                // </Link>
              ))}
          </Box>
        </Box>
        {currentSelectedPostingId && currentSelectedPosting && (
          <PostingDetailsModal
            currentSelectedPosting={currentSelectedPosting}
            currentUserState={currentUserState}
            setPostings={setPostings}
            setCurrentSelectedPosting={setCurrentSelectedPosting}
          />
        )}
      </Box>
    </>
  );
}

export default Postings;
