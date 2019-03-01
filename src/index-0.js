import React from 'react'
import { render } from 'react-dom'
import Styles from './Styles'
import { Field } from 'react-final-form'
import Wizard from './Wizard'
import './App.css';
import './index.css';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const Error = ({ name }) => (
  <Field
    name={name}
    subscribe={{ touched: true, error: true }}
    render={({ meta: { touched, error } }) =>
      touched && error ? <span>{error}</span> : null
    }
  />
)

// const required = value => (value ? undefined : 'Required')

function required(value){
  return value? undefined :'Required'
}

const App = () => (
  // <Styles>
    <Wizard
      initialValues={{ employed: true, stooge: 'larry' }}
      onSubmit={onSubmit}
    >
     <Wizard.Page >
        <div >
          <p>The CRISP-Q study.</p>
          <p>Researchers: Yena (Grace) Kim (Scholarly Selective Student), Prof Jon Emery, A/Prof Marie Pirotta and Dr Jennifer Walker The Department of General Practice, University of Melbourne

          <p>Thank you for taking part in this study. We are interested in how people think about their risk of bowel cancer and their use of bowel cancer screening tests</p>          </p>
          <p>Who can participate? </p>
          <p>Any person 40 years or older but younger than 75, attending a GP appointment at Deepdene Surgery can participate in the study.</p>
          <p>What are the risks?</p>
          <p>This survey is completely anonymous and therefore confidential, so there is no risk that we will know who said what. This study is completely voluntary and to withdraw during the study simply stop answering the questions. Due to the anonymous nature of the study we will not be able to delete your data if you withdraw.</p>
          <p>If you are concerned about your risk of bowel cancer, please discuss this with your doctor today.</p>
        </div>
      </Wizard.Page>
      <Wizard.Page >
        <div >
          <label>Name</label>
          <Field
            name="name"
            component="input"
            type="text"
            placeholder="Jhon"
            validate={required}
          />
          <Error name="name" />
        </div>
        <div>
          <label>Gender</label>
          <Field
            name="sex"
            component="input"
            type="text"
            placeholder="Male"
            validate={required}
          />
          <Error name="year" />
        </div>
        <div>
          <label>Year</label>
          <Field
            name="year"
            component="input"
            type="text"
            placeholder="1999"
            validate={required}
          />
          <Error name="year" />
        </div>
      </Wizard.Page>
      <Wizard.Page
        validate={values => {
          const errors = {}
          if (!values.email) {
            errors.email = 'Required'
          }
          if (!values.favoriteColor) {
            errors.favoriteColor = 'Required'
          }
          return errors
        }}
      >
        <div>
          <label>Email</label>
          <Field
            name="email"
            component="input"
            type="email"
            placeholder="Email"
          />
          <Error name="email" />
        </div>
        <div>
          <label>Favorite Color</label>
          <Field name="favoriteColor" component="select">
            <option />
            <option value="#ff0000">❤️ Red</option>
            <option value="#00ff00">💚 Green</option>
            <option value="#0000ff">💙 Blue</option>
          </Field>
          <Error name="favoriteColor" />
        </div>
      </Wizard.Page>
      <Wizard.Page
        validate={values => {
          const errors = {}
          if (!values.toppings) {
            errors.toppings = 'Required'
          } else if (values.toppings.length < 2) {
            errors.toppings = 'Choose more'
          }
          return errors
        }}
      >
        <div>
          <label>Employed?</label>
          <Field name="employed" component="input" type="checkbox" />
        </div>
        <div>
          <label>Toppings</label>
          <Field name="toppings" component="select" multiple>
            <option value="ham">🐷 Ham</option>
            <option value="mushrooms">🍄 Mushrooms</option>
            <option value="cheese">🧀 Cheese</option>
            <option value="chicken">🐓 Chicken</option>
            <option value="pineapple">🍍 Pinapple</option>
          </Field>
          <Error name="toppings" />
        </div>
      </Wizard.Page>
      <Wizard.Page
        validate={values => {
          const errors = {}
          if (!values.notes) {
            errors.notes = 'Required'
          }
          return errors
        }}
      >
        <div>
          <label>Best Stooge?</label>
          <div>
            <label>
              <Field
                name="stooge"
                component="input"
                type="radio"
                value="larry"
              />{' '}
              Larry
            </label>
            <label>
              <Field name="stooge" component="input" type="radio" value="moe" />{' '}
              Moe
            </label>
            <label>
              <Field
                name="stooge"
                component="input"
                type="radio"
                value="curly"
              />{' '}
              Curly
            </label>
          </div>
        </div>
        <div>
          <label>Notes</label>
          <Field name="notes" component="textarea" placeholder="Notes" />
          <Error name="notes" />
        </div>
      </Wizard.Page>
    </Wizard>
  //  </Styles>
)

render(<App />, document.getElementById("root"));

