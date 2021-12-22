import { CourseModel, SubjectModel } from 'cl-models';
import logger from './logger';

class CatalogStore {
  private loader: Promise<SubjectModel[]>;
  private lastUpdate = 0;
  private ttl = 5 * 60 * 1000;
  private sData = new Map<string, SubjectModel>();
  private cData = new Map<string, CourseModel>();

  isExpired() {
    return Date.now() - this.lastUpdate > this.ttl;
  }

  async load() {
    if (!this.loader) {
      logger.info('CatalogStore:load');
      this.loader = SubjectModel.findAll({
        order: [
          [CourseModel, 'level', 'ASC'],
          [CourseModel, 'min', 'ASC']
        ],
        include: [CourseModel]
      });
    }

    const subjects = await this.loader;
    this.loader = null;
    this.lastUpdate = Date.now();

    for (const subject of subjects) {
      this.sData.set(subject.id, subject);
      for (const course of subject.courses) {
        this.cData.set(course.id, course);
      }
    }
  }

  reset() {
    this.sData.clear();
    this.cData.clear();
  }

  async getSubjects(ids: string[]) {
    if (this.isExpired() || ids.some(id => !this.sData.has(id))) {
      await this.load();
    }

    return ids.map(id => this.sData.get(id));
  }

  async getSubjectById(id: string) {
    if (!this.sData.has(id) || this.isExpired()) {
      await this.load();
    }

    return this.sData.get(id);
  }

  async getCourses(ids: string[]) {
    if (this.isExpired() || ids.some(id => !this.cData.has(id))) {
      await this.load();
    }

    return ids.map(id => this.cData.get(id));
  }

  async getCourseById(id: string) {
    if (!this.cData.has(id) || this.isExpired()) {
      await this.load();
    }

    return this.cData.get(id);
  }
}

export const catalogStore = new CatalogStore();
