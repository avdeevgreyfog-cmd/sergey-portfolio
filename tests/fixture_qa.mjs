import { createRenderer } from '../scripts/render.mjs';
import { site, capabilities, effects } from '../.build/config/site.js';
import { publicProjects, projectCategories, featuredProject } from '../.build/projects/registry.js';
const fixture={...publicProjects[0],slug:'fixture-store',title:'Fixture Store',category:'E-commerce',type:'E-commerce',featured:false,order:99,demoRoute:'/demo/fixture-store/',cover:'fixture.webp',previewMedia:[],caseMedia:[],services:['UX'],caseStudy:{task:'fixture',solution:'fixture',done:['fixture']}};
const source=[...publicProjects,fixture];
const renderer=createRenderer({basePath:'/sergey-portfolio',siteUrl:'https://example.test',site,capabilities,effects,projects:source,projectCategories,featuredProject});
const works=renderer.works(); const home=renderer.home(); const caseHtml=renderer.casePage(fixture);
const checks=[
 [works.includes('Fixture Store'),'fixture appears in works'],
 [works.includes('data-work-filters'),'filters appear after category expansion'],
 [works.includes('data-filter="E-commerce"'),'fixture category filter appears'],
 [home.includes('Разные люди')&&!home.includes('Fixture Store</strong>'),'featured selection remains data-driven'],
 [caseHtml.includes('/demo/fixture-store/'),'generic case route renders fixture CTA']
];
const failed=checks.filter(([ok])=>!ok); if(failed.length){console.error('FIXTURE QA FAIL');failed.forEach(([,msg])=>console.error('-',msg));process.exit(1);} console.log('FIXTURE QA PASS — second project, filters, featured selection and generic case renderer scale without public fixture data');
