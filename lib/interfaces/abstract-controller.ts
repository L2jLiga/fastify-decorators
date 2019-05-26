import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';

export abstract class AbstractController<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
    public instance!: FastifyInstance<HttpServer, HttpRequest, HttpResponse>;
}