import Http from '../http'
export const slackApi = new class slackApi extends Http {
  getChannel({ channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/getChannel`,
      body: {
        token
      }
    }
    )
  }
  getMember({ channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/getMembers`,
      body: {
        token,
        channel
      }
    }
    )
  }
  postMessage({ message, channel, token, username }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/postMessage`,
      body: {
        message,
        token,
        channel,
        username
      }
    }
    )
  }
  history({ message, channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/history`,
      body: {
        token,
        channel,
      }
    }
    )
  }

  test({ message, channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${GLOB.VITE_API_PORT}/test`,
      body: {
        token
      }
    }
    )
  }
}