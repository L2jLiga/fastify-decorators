/**
 * @license
 * Copyright Andrey Chalkin <L2jLiga@gmail.com> (https://github.com/L2jLiga). All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/L2jLiga/fastify-decorators/blob/master/LICENSE
 */

import { RouteShorthandOptions } from 'fastify';
import { RouteConfig } from '../interfaces';
import { requestDecoratorsFactory } from './helpers/request-decorators.factory';

export function ALL(): (target: any, propKey?: string | symbol) => void;
export function ALL(url: string): (target: any, propKey?: string | symbol) => void;
export function ALL(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function ALL(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function ALL(config?: string | RouteConfig) {
    return requestDecoratorsFactory('all')(config);
}

export function GET(): (target: any, propKey?: string | symbol) => void;
export function GET(url: string): (target: any, propKey?: string | symbol) => void;
export function GET(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function GET(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function GET(config?: string | RouteConfig) {
    return requestDecoratorsFactory('get')(config);
}

export function POST(): (target: any, propKey?: string | symbol) => void;
export function POST(url: string): (target: any, propKey?: string | symbol) => void;
export function POST(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function POST(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function POST(config?: string | RouteConfig) {
    return requestDecoratorsFactory('post')(config);
}

export function PUT(): (target: any, propKey?: string | symbol) => void;
export function PUT(url: string): (target: any, propKey?: string | symbol) => void;
export function PUT(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function PUT(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function PUT(config?: string | RouteConfig) {
    return requestDecoratorsFactory('put')(config);
}

export function PATCH(): (target: any, propKey?: string | symbol) => void;
export function PATCH(url: string): (target: any, propKey?: string | symbol) => void;
export function PATCH(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function PATCH(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function PATCH(config?: string | RouteConfig) {
    return requestDecoratorsFactory('patch')(config);
}

export function DELETE(): (target: any, propKey?: string | symbol) => void;
export function DELETE(url: string): (target: any, propKey?: string | symbol) => void;
export function DELETE(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function DELETE(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function DELETE(config?: string | RouteConfig) {
    return requestDecoratorsFactory('delete')(config);
}

export function OPTIONS(): (target: any, propKey?: string | symbol) => void;
export function OPTIONS(url: string): (target: any, propKey?: string | symbol) => void;
export function OPTIONS(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function OPTIONS(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function OPTIONS(config?: string | RouteConfig) {
    return requestDecoratorsFactory('options')(config);
}

export function HEAD(): (target: any, propKey?: string | symbol) => void;
export function HEAD(url: string): (target: any, propKey?: string | symbol) => void;
export function HEAD(url: string, options: RouteShorthandOptions): (target: any, propKey?: string | symbol) => void;
export function HEAD(config: RouteConfig): (target: any, propKey?: string | symbol) => void;
export function HEAD(config?: string | RouteConfig) {
    return requestDecoratorsFactory('head')(config);
}

