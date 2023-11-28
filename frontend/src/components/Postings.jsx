import React from 'react';
import EmployerCard from './EmployerCard';
import CandidateCard from './CandidateCard'

function Postings({ postings }) {

    postings = [{id: 1, role: "SWE", description: "super cool SWE job", employer: "ASync", city: "NYC", state: "NY", payRate: "$150000", staus: "open", applicants: [{ id: 1, name: 'Adam' }, { id: 2, name: 'John' }], }];
    return (
        <>
        <h1> EMPLOYER VIEW </h1>
        {postings.map((posting) => (
            <EmployerCard
            key={posting.id}
            id={posting.id}
            role={posting.role}
            description={posting.description}
            employer={posting.employer}
            city={posting.city}
            state={posting.state}
            payRate={posting.payRate}
            status={posting.status}
            applicants={posting.applicants}
            />
        ))}

        <h1> CANDIDATE VIEW </h1>
        {postings.map((posting) => (
        <CandidateCard
          key={posting.id}
          id={posting.id}
          role={posting.role}
          description={posting.description}
          employer={posting.employer}
          city={posting.city}
          state={posting.state}
          payRate={posting.payRate}
          status={posting.status}
          applicants={posting.applicants}
        />
        ))}
        </>
    );
}

export default Postings;