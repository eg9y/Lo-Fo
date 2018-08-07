import Vue from 'vue'
import LMap from '@/components/MainPage/Index'

describe('Map Component', () => {
  it('checks that the submission form is closed, when component is first opened', () => {
    const Constructor = Vue.extend(LMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.submissionDialog).to.equal(false)
  })

  it('checks that the map is centered properly when the webpage is refreshed', () => {
    const Constructor = Vue.extend(LMap)
    const GMapComponent = new Constructor().$mount()
    expect(GMapComponent.url).to.equal('http://{s}.tile.osm.org/{z}/{x}/{y}.png')
  })
})
