import Vue from 'vue'
// import { mount } from '@vue/test-utils'
import Map from '@/components/MainPage/Index'

// const wrapper = mount(Map)

describe('Map Component', () => {
  it('checks that the submission form is closed, when component is first opened', () => {
    const Constructor = Vue.extend(Map)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

  it('checks that the map is centered properly when the webpage is refreshed', () => {
    const Constructor = Vue.extend(Map)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.url).to.equal('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
  })
})
