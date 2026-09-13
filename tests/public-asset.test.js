import test from 'node:test'
import assert from 'node:assert/strict'
import { publicAsset } from '../src/public-asset.js'

test('public photos and resume keep the GitHub Pages repository prefix', () => {
  assert.equal(publicAsset('/assets/people/profile-primary.png', '/MyPortfolio-Redesign/'), '/MyPortfolio-Redesign/assets/people/profile-primary.png')
  assert.equal(publicAsset('/resume/dhirendra-kumar-resume.pdf', '/MyPortfolio-Redesign/'), '/MyPortfolio-Redesign/resume/dhirendra-kumar-resume.pdf')
})

test('local root paths and encoded screenshot names remain unchanged', () => {
  assert.equal(publicAsset('/assets/people/profile-primary.png'), '/assets/people/profile-primary.png')
  assert.equal(publicAsset('/assets/projects/Screenshot%202023.png', '/MyPortfolio-Redesign'), '/MyPortfolio-Redesign/assets/projects/Screenshot%202023.png')
})
