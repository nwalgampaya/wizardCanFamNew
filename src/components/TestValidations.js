import React from 'react'
import { render } from 'react-dom'
import Styles from '../Styles'
import { Form } from 'react-final-form'
import { Field } from 'react-final-form-html5-validation'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class TestValidation extends React.Component {
  onSubmit() {

    async values => {
      await sleep(300)
      window.alert(JSON.stringify(values, 0, 2))
    }
  }
  render() {


    return (
      <Styles>
        <h1>🏁 React Final Form</h1>
        <h2>HTML5 Validation Example</h2>
        <a href="https://github.com/erikras/react-final-form#-react-final-form">
          Read Docs
    </a>
        <p>
          In this example, we replace our <code>Field</code> component from{' '}
          <code>react-final-form</code> with the one from{' '}
          <a
            href="https://github.com/final-form/react-final-form-html5-validation"
            target="_blank">
            <code>react-final-form-html5-validation</code>
          </a>{' '}
          and immediately get HTML5 validation functionality.
    </p>
        <p>
          The "Last Name" field will also display its errors the standard 🏁 React
          Final Form way.
    </p>
        <Form
          onSubmit={this.onSubmit.bind(this)}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit}>
              {/* <div>
            <label>First Name</label>
            <Field
              name="firstName"
              component="input"
              type="text"
              placeholder="First Name"
              pattern="[A-Z].+"
              patternMismatch="Capitalize your name!"
              valueMissing="Who are you??"
              required
              minLength={4}
              tooShort="You need a longer name"
            />
            <input {...input} {...rest} />
                {error && touched && <span>{error}</span>}
          </div> */}
              <Field
                name="FirstName"
                type="text"
                placeholder="First Name"
                required
                valueMissing="Please enter the first Name?">
                {({ input, meta: { error, touched }, ...rest }) => (
                  <div>
                    <label>Last Name</label>
                    <input {...input} {...rest} />
                    <div className="inline-error ">
                      {error && touched && <span>{error}</span>}
                    </div>

                  </div>
                )}
              </Field>
              <Field
                name="lastName"
                type="text"
                placeholder="Last Name"
                required
                valueMissing="Who are you??">
                {({ input, meta: { error, touched }, ...rest }) => (
                  <div>
                    <label>Last Name</label>
                    <input {...input} {...rest} />
                    {error && touched && <span>{error}</span>}
                  </div>
                )}
              </Field>
              <div>
                <label>Email</label>
                <Field
                  name="email"
                  type="email"
                  typeMismatch="That's not an email address"
                  component="input"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <label>Favorite Color</label>
                <Field
                  name="favoriteColor"
                  component="select"
                  required
                  validate={value =>
                    value === '#00ff00'
                      ? 'You like Green? 🤢 Pick again!'
                      : undefined
                  }>
                  <option />
                  <option value="#ff0000">❤️ Red</option>
                  <option value="#00ff00">💚 Green</option>
                  <option value="#0000ff">💙 Blue</option>
                </Field>
              </div>
              <div>
                <label>Notes</label>
                <Field name="notes" component="textarea" placeholder="Notes" />
              </div>
              <div className="buttons">
                <button type="submit" disabled={submitting}>
                  Submit
            </button>
                <button type="button" onClick={reset} disabled={submitting}>
                  Reset
            </button>
              </div>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          )}
        />
      </Styles>
    )
  }

}


// render(<App />, document.getElementById('root'))
