import { Injector } from '../models/dependency-injection/injector.service';
import { Providers } from '../decorators/_index';
import { LifeCycleService } from '../services/life-cycle/life-cycle.service';

export const getClassDependencies = (clazz: any) => {
  // Getting the params to be injected declared inside the constructor.
  const providers = Reflect.getMetadata('design:paramtypes', clazz) || [];
  return providers.map(provider => Injector.resolve(provider.name));
};

export const loadInjectables = () => {
  Providers.forEach(provider => {
    Injector.set(provider.name, provider, getClassDependencies(provider));
  })
}

export const destroyInjectables = () => {
  Injector.getProviders().forEach(async value => {
    await LifeCycleService.triggerProviderDestroy(value);
  });
}
