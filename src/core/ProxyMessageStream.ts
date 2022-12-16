import {
  BasePostMessageStream,
  PostMessageEvent,
} from "@metamask/post-message-stream";

interface ProxyMessageStreamArgs {
  name: string;
  target: string;
  targetOrigin?: string;
  targetWindow?: Window;
}

/**
 * A {@link Window.postMessage} stream.
 */
class ProxyMessageStream extends BasePostMessageStream {
  _name;

  _target;

  _targetOrigin;

  _targetWindow;

  /**
   * Creates a stream for communicating with other streams across the same or
   * different `window` objects.
   *
   * @param args - Options bag.
   * @param args.name - The name of the stream. Used to differentiate between
   * multiple streams sharing the same window object.
   * @param args.target - The name of the stream to exchange messages with.
   * @param args.targetOrigin - The origin of the target. Defaults to
   * `location.origin`, '*' is permitted.
   * @param args.targetWindow - The window object of the target stream. Defaults
   * to `window`.
   */
  constructor({
    name,
    target,
    targetOrigin = window.location.origin,
    targetWindow = window,
  }: ProxyMessageStreamArgs) {
    super();

    if (
      typeof window === "undefined" ||
      typeof window.postMessage !== "function"
    ) {
      throw new Error(
        "window.postMessage is not a function. This class should only be instantiated in a Window."
      );
    }

    this._name = name;
    this._target = target;
    this._targetOrigin = targetOrigin;
    this._targetWindow = targetWindow;
    this._onMessage = this._onMessage.bind(this);

    window.addEventListener("message", this._onMessage, false);

    this._handshake();
  }

  _postMessage(data: unknown): void {
    console.log('[ProxyMessageStream LOG] ProxyService returning result to RN App', data);
    this._targetWindow.postMessage(
      JSON.stringify({
        target: this._target,
        data,
      }),
      this._targetOrigin
    );
  }

  _onMessage(event: PostMessageEvent): void {
    if (event.origin !== "") return;
    const message = JSON.parse(event.data as string);

    if (message.target !== this._name) return;

    /*if (
        (this._targetOrigin !== '*' && event.origin !== this._targetOrigin) ||
        event.source !== this._targetWindow ||
        !isValidStreamMessage(message) ||
        message.target !== this._name
      ) {
        return;
      }*/

    console.log('[ProxyMessageStream LOG] ProxyService sending message to iframe', message.data);
    this._onData(message.data);
  }

  _destroy() {
    window.removeEventListener("message", this._onMessage, false);
  }
}

export { ProxyMessageStream };
