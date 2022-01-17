import 'reflect-metadata';

import * as sinon from 'sinon';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { Injectable } from '../../decorators';
import { ProviderNotFoundException } from '../../models';
import { DiContainer } from './di-container.class';

const test = suite('Dependency Injection Container');

test.before.each((context) => {
  @Injectable()
  class ProviderOne {}

  @Injectable()
  class ProviderTwo {
    constructor(private providerOne: ProviderOne) {}
    testMethod() {
      return 'ProviderTwo.testMethod';
    }
  }

  @Injectable()
  class ProviderThree {
    constructor(private providerTwo: ProviderTwo, private providerOne: ProviderOne) {}
  }

  @Injectable()
  class ProviderFour {
    constructor(private providerTwo: ProviderTwo, private providerThree: ProviderThree) {}
    testMethod() {
      return `ProviderFour.testMethod ${this.providerTwo.testMethod()}`;
    }
  }

  context.sandbox = sinon.createSandbox();

  context.providers = {
    providerOne: ProviderOne,
    providerTwo: ProviderTwo,
    providerThree: ProviderThree,
    providerFour: ProviderFour,
  };

  const onInit = context.sandbox.spy((name, instance) => ({ name, instance }));
  const onDestroy = context.sandbox.spy((name, instance) => ({ name, instance }));

  context.sandbox.stubs = { onInit, onDestroy };

  context.container = new DiContainer({ onInit, onDestroy });

  context.container.set(context.providers.providerOne, context.providers.providerOne.name);
  context.container.set(context.providers.providerTwo, context.providers.providerTwo.name);
  context.container.set(context.providers.providerThree, context.providers.providerThree.name);
  context.container.set(context.providers.providerFour, context.providers.providerFour.name);
});

test.after.each((context) => {
  context.sandbox.restore();
  context.container.unsetAll();
});

test('should set providers', (context) => {
  const providerFour = context.container.get(context.providers.providerFour.name);
  assert.instance(context.container.get(context.providers.providerOne.name), context.providers.providerOne);
  assert.instance(context.container.get(context.providers.providerTwo.name), context.providers.providerTwo);
  assert.instance(context.container.get(context.providers.providerThree.name), context.providers.providerThree);
  assert.instance(providerFour, context.providers.providerFour);
  assert.is(providerFour.testMethod(), 'ProviderFour.testMethod ProviderTwo.testMethod');
  assert.is(context.sandbox.stubs.onInit.callCount, 4);
});

test('should unset providers', (context) => {
  // Create instances.
  context.container.get(context.providers.providerOne.name);
  context.container.get(context.providers.providerTwo.name);
  context.container.get(context.providers.providerThree.name);
  context.container.get(context.providers.providerFour.name);

  // Begin unset.
  context.container.unset(context.providers.providerOne.name);
  assert.throws(
    () => context.container.get(context.providers.providerOne.name),
    (err) => err instanceof ProviderNotFoundException,
  );

  context.container.unsetAll();
  assert.throws(
    () => context.container.get(context.providers.providerFour.name),
    (err) => err instanceof ProviderNotFoundException,
  );
  assert.is(context.sandbox.stubs.onDestroy.callCount, 4);
});

test.run();
