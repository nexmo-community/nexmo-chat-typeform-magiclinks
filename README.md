![Nexmo][logo]

# Nexmo Chat with Passport.js, Magic Links and Typeform

This project supports an article where you learn how to set up a basic [Typeform](https://www.typeform.com/) form and capture data from a webhook in [Node.js](https://nodejs.org/en/) framework [Express.js](https://expressjs.com/). You'll use [Passport.js](http://www.passportjs.org/) to authenticate a user, use [Nexmo's Node.js Server SDK](https://github.com/Nexmo/nexmo-node/tree/beta) to register a user, and generate a JWT to use with [Nexmo's JavaScript Client SDK](https://developer.nexmo.com/client-sdk/overview).

The master branch is the starting point for this guide and as such expects you to run a basic client-side chat application by hardcoding credentials into JavaScript and running the application.

Switch to the `tutorial-finish` branch to find additional steps for using this application with Typeform and [Nexmo's Node.js Server SDK](https://github.com/Nexmo/nexmo-node/tree/beta).

**Table of Contents**

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
    - [Node & NPM](#node--npm)
    - [Nexmo Account](#nexmo-account)
    - [Nexmo CLI](#nexmo-cli)
    - [MongoDB](#mongodb)
    - [Ngrok](#ngrok)
    - [Typeform](#typeform)
    - [Email SMTP Provider](#email-smtp-provider)
  - [Run the Application](#run-the-application)
    - [Basic Installation](#basic-installation)
    - [Running Ngrok](#running-ngrok)
    - [Create Nexmo Application](#create-nexmo-application)
    - [Create Nexmo Conversation](#create-nexmo-conversation)
    - [Creating a Typeform](#creating-a-typeform)
    - [Configure the Application](#configure-the-application)
- [Code of Conduct](#code-of-conduct)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

#### Node & NPM

This application was developed using Node.js 13.1 and NPM 6.12. Check you have stable or long-term support versions of Node.js installed, at least.

```bash
node --version
```

```bash
npm --version
```

If you don't have Node.js or NPM, or you have older versions, head over to [nodejs.org and install the correct version](https://nodejs.org/en/) if you don't have it.

#### Nexmo Account

[Sign up for a free Nexmo account](https://dashboard.nexmo.com/sign-up).

#### Nexmo CLI

To set up your application, you'll need to install the [Nexmo CLI](https://github.com/Nexmo/nexmo-cli/tree/beta). Install it using NPM in terminal.

```bash
npm install -g nexmo-cli@beta
```

Now, configure the CLI using your API key and secret, found on your [Nexmo account dashboard](https://dashboard.nexmo.com/).

```bash
nexmo setup <your_api_key> <your_api_secret>
```

#### MongoDB

Follow the correct [MongoDB Community Edition installation guide](https://docs.mongodb.com/manual/administration/install-community/) for your system.

#### Ngrok

[Sign up and configure ngrok](https://ngrok.com/) by following the instructions on their site.

#### Typeform

[Sign-up now for a free Typeform account](https://admin.typeform.com/signup).

#### Email SMTP Provider

You'll be sending emails. You'll need the hostname, port, a login and a password for an SMTP provider.

You can use [Google Mail to send email from an app](https://support.google.com/a/answer/176600?hl=en).

### Run the Application

This application is a chat application built using Bootstrap and the [Nexmo JavaScript Client SDK](https://developer.nexmo.com/client-sdk/overview). You use Typeform to register users, click on magic links to authenticate and join a Nexmo conversation.

#### Basic Installation

Clone the demo application straight from GitHub.

```bash
git clone https://github.com/nexmo-community/nexmo-chat-typeform-magiclinks.git
```

Once cloned, change into the new demo application directory.

```bash
cd nexmo-chat-typeform-magiclinks
```

Install the npm dependencies.

```bash
npm install
```

Start the application the standard way.

```bash
npm start
```

Start the application, but with nodemon instead.

```bash
npm run dev
```

#### Running Ngrok

You need to run ngrok to receive information to the webhook from Typeform.

```bash
ngrok http 3000
```

This needs to be running in the same directory and at the same time as the application running with `npm`.

#### Create Nexmo Application

```bash
nexmo app:create "Nexmo RTC Chat" --capabilities=rtc --rtc-event-url=http://example.com --keyfile=private.key
# Application created: 4556dbae-bf...f6e33350d8
# Credentials written to .nexmo-app
# Private Key saved to: private.key
```

#### Create Nexmo Conversation

```bash
nexmo conversation:create display_name="Typeform Chatroom"
# Conversation created: CON-a57b0...11e57f56d
```

#### Creating a Typeform

You can capture as much data as you like from your Typeform. But, for this application, ensure you have a least an email field on the form.

Once you have created your Typeform, click over to the **Connect** tab on your Typeform edit page and click on **Webhooks**.

Click on **Add a webhook** and enter the URL as `https://<your_url>.ngrok.io/webhooks/magiclink`. Then click **Save webhook**.

#### Configure the Application

Create a `.env` file using `.env.example` and configure the application as shown.

```bash
# app config
PORT=3000                                         # default port for node apps running locally
SECRET=whateveryouwant                            # a secret alphanumeric string

# typeform config
FORM_URL=https://username.typeform.com/to/123456  # public typeform URL
FORM_FIELD_TYPE=email                             # email type is expected
FORM_FIELD_REF=e8b6-5b1-4f5-8ee-bth81             # typeform question reference

# mongodb config
MONGO_URL=mongodb://127.0.0.1:27017/database      # url to mongo server/database

# nexmo config
NEXMO_API_KEY=<api-key>                           # from the nexmo dashboard 
NEXMO_API_SECRET=<api-secret>                     # from the nexmo dashboard
NEXMO_APP_ID=4556dbae-bf...f6e33350d8             # from the command ran above
NEXMO_PRIVATE_KEY_PATH=./private.key              # from the command ran above
NEXMO_CONVERSATION_ID=CON-a57b0...11e57f56d       # from the command ran above

# smtp config
SMTP_HOST=smtp.gmail.com                          # your smtp hostname
SMTP_PORT=465                                     # your smtp host port
SMTP_AUTH_USER=<smtp-username>                    # your smtp username
SMTP_AUTH_PASS=<smtp-password>                    # your smtp password
```

Once configured, start the application. If you restart ngrok, you'll need to reconfigure your webhook in the Typeform settings.

```bash
npm start
```

## Code of Conduct

In the interest of fostering an open and welcoming environment, we strive to make participation in our project and our community a harassment-free experience for everyone. Please check out our [Code of Conduct][coc] in full.

## Contributing 
We :heart: contributions from everyone! Check out the [Contributing Guidelines][contributing] for more information.

[![contributions welcome][contribadge]][issues]

## License

This project is subject to the [MIT License][license]

[logo]: nexmo.png "Nexmo"
[contribadge]: https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat "Contributions Welcome"

[coc]: CODE_OF_CONDUCT.md "Code of Conduct"
[contributing]: CONTRIBUTING.md "Contributing"
[license]: LICENSE "MIT License"

[issues]: ./../../issues "Issues"
