import Mock from 'mockjs'

Mock.mock('/api/soil/properties', 'get', {
  'data|10': [{
    'id|+1': 1,
    'ph': '@float(3, 8, 1, 1)',
    'organic': '@float(0.5, 5, 1, 1)'
  }]
})