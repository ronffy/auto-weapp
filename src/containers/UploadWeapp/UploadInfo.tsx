
import React from 'react';
import styles from './UploadInfo.less';

const UploadInfo = ({ packages, total }) => (
  <div>
    <p><span>包体积: </span><span>{total}</span><span>KB</span></p>
    <ul>
      {
        packages.map(({ name, size }) => <li><p>{name} 体积: {size}</p></li>)
      }
    </ul>
  </div>
)

export default UploadInfo