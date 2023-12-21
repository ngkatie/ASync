import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmployerCard from './EmployerCard';
import Navbar from './Navbar';
import {
  Box,
  Button,
  Pagination,
  Stack,
  Typography,
  TextField,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostingCard from './PostingCard';
import PostingDetailsModal from './PostingDetailsModal';
import { validateSearchInput, validStr } from '../validation';

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
  const [selectedFilter, setSelectedFilter] = useState('');
  const [employers, setEmployers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of employers
    async function fetchEmployers() {
      try {
        const response = await axios.get(
          'http://3.23.52.34:3000/api/employers'
        );
        setEmployers(response.data);
      } catch (error) {
        console.error('Error fetching employers:', error);
      }
    }

    // Call the function to fetch employers
    fetchEmployers();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (isNaN(page) || page < 1) {
        navigate('/400');
        return;
      }

      try {
        let url = 'http://3.23.52.34:3000/api/postings';
        const queryParams = [];
        if (searchInput) {
          queryParams.push(`search=${searchInput}`);
        }
        if (selectedFilter) {
          queryParams.push(`filter=${selectedFilter}`);
        }
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        let postingList = await axios.get(url);
        setAllPostings(postingList.data);

        if (postingList.data.length !== 0) {
          setCurrentSelectedPostingId(postingList.data[0]._id);
        } else {
          setCurrentSelectedPostingId('');
        }

        setNumberOfTotalPostings(postingList.data.length);
        let index = (page - 1) * 10;
        setStartingIndex(index);
        setPostings(postingList.data.slice(index, index + 10));
        console.log(postings);
      } catch (e) {
        alert(e);
        navigate('/404');
      }
    }

    fetchData();
  }, [page, finalSearch, selectedFilter]);

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
            `http://3.23.52.34:3000/api/postings/${currentSelectedPostingId}`
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

  const handleSearch = (searchInput) => {
    if (validStr(searchInput) && searchInput.length <= 0) {
      alert('must input a valid search');
    } else if (!validateSearchInput(searchInput)) {
      alert('search input must be under 100 characters');
    } else {
      setFinalSearch(searchInput);
    }
  };

  const hidePrevButton = page === 1;
  const hideNextButton = numberOfTotalPostings - startingIndex <= 10;

  return (
    <>
      <Navbar />
      <Box sx={{ mt: 11 }}>
        <Typography sx={{ color: 'black', mb: 3 }}>
          Search based on Title, Description, Company, State, City, Skills, or
          Job Type!
        </Typography>
        <Box
          sx={{
            mb: 5,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <TextField
            type='text'
            placeholder='Search...'
            value={searchInput}
            required
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ width: '400px' }}
          />
          <Button
            variant='contained'
            onClick={() => handleSearch(searchInput)}
            sx={{ ml: 3, width: '100px' }}
          >
            Search
          </Button>
          <Typography sx={{ color: 'black', display: 'inline', ml: 6 }}>
            Filter:
          </Typography>
          <TextField
            select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            sx={{ width: '200px', ml: 2 }}
            placeholder={'Choose'}
          >
            <MenuItem key={'None'} value={''}>
              None
            </MenuItem>
            {[
              ...new Map(
                employers.map((employer) => [employer.companyName, employer])
              ).values(),
            ].map((employer) => (
              <MenuItem key={employer._id} value={employer.companyName}>
                {employer.companyName}
              </MenuItem>
            ))}
          </TextField>
        </Box>
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
            <Typography>No postings for your criteria!</Typography>
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
