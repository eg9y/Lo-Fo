import Vue from 'vue'
import NavBar from '@/components/Navigation/NavBar'

describe('NavBar.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(NavBar)
    const AppComponent = new Constructor().$mount()
    expect(AppComponent.drawer).to.be.an('boolean')
    // expect(AppComponent.drawer).to.be(false)
  })
})
