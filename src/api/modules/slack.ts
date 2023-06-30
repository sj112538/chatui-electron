import { nodePort } from '@/init'
import Http from '../http'
export const slackApi = new class slackApi extends Http {
  getChannel({ channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${nodePort.value}/getChannel`,
      body: {
        token
      }
    }
    )
  }
  getMember({ channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${nodePort.value}/getMembers`,
      body: {
        token,
        channel
      }
    }
    )
  }
  postMessage({ message, channel, token, username }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${nodePort.value}/postMessage`,
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
      allUrl: `http://127.0.0.1:${nodePort.value}/history`,
      body: {
        token,
        channel,
      }
    }
    )
  }

  test({ message, channel, token }: Slack) {
    return this.post('post', {
      allUrl: `http://127.0.0.1:${nodePort.value}/test`,
      body: {
        token
      }
    }
    )
  }
}