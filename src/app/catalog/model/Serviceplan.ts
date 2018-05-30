/**
 * Created by 박철한 on 2018-05-29.
 */
export class ServicePlan{
  private _metadata;
  private _entity;

  constructor(entity, metadata){
    this._entity = entity;
    this._metadata = metadata;
  }
  private get metadata() {
    return this._metadata;
  }

  // using constructor or refreshing
  private set metadata(extMetadata) {
    if (extMetadata === null || extMetadata === undefined) {
      this._metadata = {
        created_at: '(created_at_dummy)',
        guid: '(id_dummy)',
        updated_at: '(updatedAt_dummy)',
        url: '(org_url_dummy)'
      };
    } else {
      this._metadata = extMetadata;
    }
  }

  private get entity() {
    return this._entity;
  }

  // using constructor or refreshing
  private set entity(extEntity) {
    if (extEntity === null || extEntity === undefined) {
      this._entity = {
        active: '(active_dummy)',
        bindable: '(bindable_dummy)',
        description: '(description_dummy)',
        extra: '(extra_dummy)',
        free : '(free_dummy)',
        name: '(name_dummy)',
        public: '(public_dummy)',
        schemas: '(schemas_dummy)',
        service_guid: '(service_guid_dummy)',
        service_instances_url: '(service_instances_url_dummy)',
        service_url: '(service_url_dummy)',
        unique_id: '(unique_id_dummy)',
      };
    } else {
      this._entity = extEntity;
    }
  }

  get active(){
    return this._entity.active;
  }
  get bindable(){
    return this._entity.bindable;
  }
  get description(){
    return this._entity.description;
  }
  get extra(){
    return this._entity.extra;
  }
  get free(){
    return this._entity.free;
  }
  get name(){
    return this._entity.name;
  }
  get public(){
    return this._entity.public;
  }
  get schemas(){
    return this._entity.schemas;
  }
  get service_guid(){
    return this._entity.service_guid;
  }
  get service_instances_url(){
    return this._entity.service_instances_url;
  }
  get service_url(){
    return this._entity.service_url;
  }
  get unique_id(){
    return this._entity.unique_id;
  }
  get guid(){
    return this._metadata.guid;
  }
}
