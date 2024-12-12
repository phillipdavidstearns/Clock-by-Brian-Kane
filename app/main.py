from tornado.web import Application, RequestHandler, StaticFileHandler
from tornado.httpserver import HTTPServer
from tornado.ioloop import IOLoop
import os
import logging
import signal
from decouple import config

def launch_app():

  class MyStaticFileHandler(StaticFileHandler):
    def set_extra_headers(self, path):
        # Disable cache
        self.set_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')

  class DefaultHandler(RequestHandler):
    def prepare(self):
      self.set_status(404)

  class MainHandler(RequestHandler):
    async def get(self):
      self.render('index.html')

  def make_app():
    path = os.path.dirname(os.path.abspath(__file__))
    
    settings = dict(
      template_path = os.path.join(path, 'templates'),
      static_path = os.path.join(path, 'static'),
      debug = True
    )

    urls = [
      (r'/', MainHandler)
    ]

    return Application(urls, **settings)

  application = make_app()
  http_server = HTTPServer(application)
  http_server.listen(config('PORT', default=80, cast=int))
  main_loop = IOLoop.current()
  main_loop.start()

if __name__ == '__main__':

  def signalHandler(signum, frame):
    print()
    logging.warning('Caught termination signal: %s' % signum)
    shutdown(status=1)

  def shutdown(status=1):
    os._exit(status)

  signal.signal(signal.SIGTERM, signalHandler)
  signal.signal(signal.SIGHUP, signalHandler)
  signal.signal(signal.SIGINT, signalHandler)

  logging.basicConfig(
      level=10,
      format='[WIDGETS APP] - %(levelname)s | %(message)s'
    )

  try:
    launch_app()
  except Exception as e:
    logging.error('Uncaught while running main(): %s' % repr(e))
  finally:
    shutdown(0)