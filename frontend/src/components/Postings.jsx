import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployerCard from './EmployerCard';
import Navbar from './Navbar';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostingCard from './PostingCard';
import PostingDetailsModal from './PostingDetailsModal';

function Postings() {
  let { page } = useParams();
  page = Number(page);

  const [postings, setPostings] = useState([]);
  const [numberOfTotalPostings, setNumberOfTotalPostings] = useState(0);
  const [currentSelectedPostingId, setCurrentSelectedPostingId] = useState('');
  const [currentSelectedPosting, setCurrentSelectedPosting] = useState({});
  const [startingIndex, setStartingIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      if (isNaN(page) || page < 1) {
        navigate('/400');
        return;
      }
      try {
        let postingList = await axios.get(
          `http://localhost:3000/api/postings/page/${page}`
        );
        setPostings(postingList.data);
        console.log(postingList.data);
        if (postingList.data.length !== 0) {
          setCurrentSelectedPostingId(postingList.data[0]._id);
        }
        const totalPostings = await axios.get(
          'http://localhost:3000/api/postings'
        );
        setNumberOfTotalPostings(totalPostings.data.length);
        let index = (page - 1) * 10;
        setStartingIndex(index);
      } catch (e) {
        alert(e);
        navigate('/404');
      }
    }
    fetchData();
  }, [page, currentPage]);

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
          mt: 11,
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
