import React from 'react';
import './Form.css'
import { Container, Row, Card, Button } from "react-bootstrap";
import { useState } from "react";
import { MultiStepForm } from './MultiStepForm';
import { questions } from "./Questions";
import ky from 'ky';

const Form = () => {


    const [index, setIndex] = useState(1);
    const [submitted, setSubmitted] = useState(false);
    const totalPagesCount = questions?.length || 0;
    // numbered by pages. for exampe { 1: [{"key" : "value"}], 2:["key": "value"], 3: []}
    const [pagesAnswers, setPagesAnswers] = useState({
    });

    const prevButton = () => {
      if (index > 1) {
        setIndex(prevIndex => prevIndex - 1);
      }
    }

    const nextButton = async () => {

      if (index < 17) {
        setIndex(prevIndex => prevIndex + 1);
      } else {
        console.log(pagesAnswers);
        // reinitialiser le form
        let values = {};
        Object.values(pagesAnswers).forEach((item) => {
          delete item.index;
          values = {...values,...item};
        });
        console.log(values);
      await ky
        .post("http://localhost:8000/entreprise", { json: values })
        .then(() => {
          setPagesAnswers({});
          setSubmitted(true);
        })
        .catch((e) => {});
      }
    }

    const onPageAnswerUpdate = (step, answersObj) => {
      setPagesAnswers({...pagesAnswers, [step]: answersObj});
    }

    const handleStart = () => {
      setIndex(1);
      setSubmitted(false);
    }

  return (
    <div className='Form'>
         <Container className="h-100" >
        <div className='form' >
          {
            submitted ?
            <Card>
              <Card.Body>
                <p>Votre candidature a bien ete envoyee. Nous vous remercions.!</p>
                
              </Card.Body>
              <Card.Footer>
                <Button onClick={handleStart}>Recommencer</Button>
               
               
              </Card.Footer>
            </Card> :
          <Card>
            <Card.Body>
              <MultiStepForm
                list={questions}
                step={index}
                onPageUpdate={onPageAnswerUpdate}
                pagesAnswers={pagesAnswers}
                />
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between ">
              <Button onClick={prevButton} disabled={index == 1}>Retour</Button>
              <Button onClick={nextButton}>{index == totalPagesCount ? 'Valider' : 'Suivant'}</Button>
            </Card.Footer>
          </Card>
        }
        </div>
      </Container>
    </div>
  )
}

export default Form
