export const servicesWithDestructors = new Map();

export function Destructor(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol): void => {
    servicesWithDestructors.set(target.constructor, propertyKey);
  };
}
