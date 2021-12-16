import { LifeCycleService } from '../../services/life-cycle/life-cycle.service';
import { NATIVE_SERVICES } from '../constants/native-services';
import { Injector } from './injector.service';

export class ModuleService {
  private modules = [];
  private instances = [];

  push(modules: any): void {
    this.modules.push(modules);
  }

  getAll(): any[] {
    return this.modules;
  }

  getInstances(): any[] {
    return this.instances;
  }

  async initModules(): Promise<void> {
    for (const module of this.modules) {
      const instance = new module();
      this.instances.push(instance);
      await LifeCycleService.triggerModuleInit(instance);
    }
  }

  async destroyModules(): Promise<void> {
    for (const module of this.instances) {
      await LifeCycleService.triggerModuleDestroy(module);
    }
  }
}

Injector.setNative(NATIVE_SERVICES.MODULE, ModuleService);
export const Modules = Injector.resolve<ModuleService>(NATIVE_SERVICES.MODULE);
